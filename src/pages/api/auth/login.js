import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { userQueries } from '../../../lib/database.js';

const JWT_SECRET = 'numerica-auction-secret-key-2025';

export async function POST({ request }) {
  try {
    const { phone, password } = await request.json();

    if (!phone || !password) {
      return new Response(JSON.stringify({ error: 'Teléfono y contraseña son requeridos' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Find user
    const user = userQueries.findByPhone.get(phone);
    if (!user) {
      return new Response(JSON.stringify({ error: 'Credenciales inválidas' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return new Response(JSON.stringify({ error: 'Credenciales inválidas' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, name: user.name, phone: user.phone },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    return new Response(JSON.stringify({ 
      success: true,
      token,
      user: {
        id: user.id,
        name: user.name,
        phone: user.phone
      }
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Login error:', error);
    return new Response(JSON.stringify({ error: 'Error interno del servidor' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

