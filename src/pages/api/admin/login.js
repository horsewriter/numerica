import jwt from 'jsonwebtoken';
import { sql } from '../../../lib/db.js';
import { scryptSync } from 'crypto';

const JWT_SECRET = 'numerica-auction-admin-secret-key-2025';

function verifyPassword(stored, passwordAttempt) {
  const [salt, key] = stored.split(':');
  const hashAttempt = scryptSync(passwordAttempt, salt, 64).toString('hex');
  return key === hashAttempt;
}

export async function POST({ request }) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return new Response(JSON.stringify({ error: 'Usuario y contraseña son requeridos' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Buscar admin
    const admins = await sql`
      SELECT * FROM admin_users WHERE username = ${username}
    `;
    if (admins.length === 0) {
      return new Response(JSON.stringify({ error: 'Credenciales inválidas' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const admin = admins[0];

    // Verificar password usando scrypt
    if (!verifyPassword(admin.password, password)) {
      return new Response(JSON.stringify({ error: 'Credenciales inválidas' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Crear token JWT
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
    return new Response(JSON.stringify({ error: error.message || 'Error interno del servidor' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
