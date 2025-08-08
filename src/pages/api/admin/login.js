import jwt from 'jsonwebtoken';
import { adminQueries } from '../../../lib/database.js';

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
    const admin = adminQueries.findByUsername.get(username);
    if (!admin || admin.password !== password) {
      return new Response(JSON.stringify({ error: 'Credenciales inválidas' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

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

