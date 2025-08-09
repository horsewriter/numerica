import { scryptSync, randomBytes } from 'crypto';
import { sql } from '../../../lib/db.js';

function hashPassword(password) {
  const salt = randomBytes(16).toString('hex');
  const hash = scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${hash}`;
}

export async function POST({ request }) {
  try {
    const { name, phone, password } = await request.json();

    if (!name || !phone || !password) {
      return new Response(JSON.stringify({ error: 'Todos los campos son requeridos' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Verificar si usuario existe
    const existingUsers = await sql`
      SELECT id FROM users WHERE phone = ${phone}
    `;
    if (existingUsers.length > 0) {
      return new Response(JSON.stringify({ error: 'El número de teléfono ya está registrado' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Hashear la contraseña con crypto
    const hashedPassword = hashPassword(password);

    // Crear usuario en BD
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
