import jwt from 'jsonwebtoken';
import { sql } from '../../../lib/db.js';

const JWT_SECRET = 'numerica-auction-admin-secret-key-2025';

export async function POST({ request }) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return new Response(JSON.stringify({ error: 'Usuario y contraseña son requeridos' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Find admin user
    const admins = await sql`
      SELECT * FROM admin_users WHERE username = ${username}
    `;
    if (admins.length === 0 || admins[0].password !== password) {
      return new Response(JSON.stringify({ error: 'Credenciales inválidas' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const admin = admins[0];

    // Generate JWT token
    const token = jwt.sign(
      { adminId: admin.id, username: admin.username, role: 'admin' },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    return new Response(JSON.stringify({ 
      success: true,
      token,
      admin: {
        id: admin.id,
        username: admin.username
      }
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Admin login error:', error);
    return new Response(JSON.stringify({ error: 'Error interno del servidor' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

