import bcrypt from 'bcryptjs';
import { sql } from '../../../lib/db.js';

export async function POST({ request }) {
  try {
    const { name, phone, password } = await request.json();

    if (!name || !phone || !password) {
      return new Response(JSON.stringify({ error: 'Todos los campos son requeridos' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Check if user already exists
    const existingUsers = await sql`
      SELECT id FROM users WHERE phone = ${phone}
    `;
    if (existingUsers.length > 0) {
      return new Response(JSON.stringify({ error: 'El número de teléfono ya está registrado' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const result = await sql`
      INSERT INTO users (name, phone, password) 
      VALUES (${name}, ${phone}, ${hashedPassword})
      RETURNING id
    `;

    return new Response(JSON.stringify({ 
      success: true, 
      message: 'Usuario registrado exitosamente',
      userId: result[0].id
    }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Registration error:', error);
    return new Response(JSON.stringify({ error: 'Error interno del servidor' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

