import jwt from 'jsonwebtoken';
import { sql } from '../../../lib/db.js';

const JWT_SECRET = 'numerica-auction-admin-secret-key-2025';

export async function GET() {
  try {
    const machines = await sql`
      SELECT * FROM machines 
      WHERE status = 'active' 
      ORDER BY current_price DESC
    `;
    
    return new Response(JSON.stringify({ 
      success: true,
      machines 
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Get machines error:', error);
    return new Response(JSON.stringify({ error: 'Error interno del servidor' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

export async function POST({ request }) {
  try {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ error: 'Token de autorización requerido' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const token = authHeader.substring(7);
    
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      if (decoded.role !== 'admin') {
        throw new Error('Not admin');
      }
    } catch (jwtError) {
      return new Response(JSON.stringify({ error: 'Token inválido' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const { name, description, image_url, initial_price, ends_at } = await request.json();

    if (!name || !initial_price) {
      return new Response(JSON.stringify({ error: 'Nombre y precio inicial son requeridos' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const result = await sql`
      INSERT INTO machines (name, description, image_url, initial_price, current_price, ends_at) 
      VALUES (${name}, ${description || ''}, ${image_url || ''}, ${initial_price}, ${initial_price}, ${ends_at || null})
      RETURNING id
    `;

    return new Response(JSON.stringify({ 
      success: true,
      message: 'Máquina creada exitosamente',
      machineId: result[0].id
    }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Create machine error:', error);
    return new Response(JSON.stringify({ error: 'Error interno del servidor' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

