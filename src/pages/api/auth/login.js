import { scryptSync, timingSafeEqual } from 'crypto';
import jwt from 'jsonwebtoken';
import { sql } from '../../../lib/db.js';

const JWT_SECRET = 'numerica-auction-secret-key-2025';

// Función para verificar contraseña
function verifyPassword(storedHash, passwordAttempt) {
  const [salt, key] = storedHash.split(':');
  const hashAttempt = scryptSync(passwordAttempt, salt, 64);
  const keyBuffer = Buffer.from(key, 'hex');

  // timingSafeEqual previene ataques por diferencia de tiempos
  if (keyBuffer.length !== hashAttempt.length) return false;
  return timingSafeEqual(keyBuffer, hashAttempt);
}

export async function POST({ request }) {
  try {
    const { phone, password } = await request.json();

    if (!phone || !password) {
      return new Response(JSON.stringify({ error: 'Teléfono y contraseña son requeridos' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Buscar usuario
    const users = await sql`
      SELECT * FROM users WHERE phone = ${phone}
    `;
    if (users.length === 0) {
      return new Response(JSON.stringify({ error: 'Credenciales inválidas' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const user = users[0];

    // Verificar contraseña con crypto
    const isValidPassword = verifyPassword(user.password, password);
    if (!isValidPassword) {
      return new Response(JSON.stringify({ error: 'Credenciales inválidas' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Generar JWT
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
