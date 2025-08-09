import jwt from 'jsonwebtoken';
import { sql } from '../../../lib/db.js';

const JWT_SECRET = 'numerica-auction-secret-key-2025';

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
    let decoded;
    
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (jwtError) {
      return new Response(JSON.stringify({ error: 'Token inválido' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const { machine_id, amount } = await request.json();

    if (!machine_id || !amount) {
      return new Response(JSON.stringify({ error: 'ID de máquina y monto son requeridos' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Get current machine data
    const machines = await sql`
      SELECT * FROM machines WHERE id = ${machine_id}
    `;
    if (machines.length === 0) {
      return new Response(JSON.stringify({ error: 'Máquina no encontrada' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const machine = machines[0];

    if (machine.status !== 'active') {
      return new Response(JSON.stringify({ error: 'La subasta no está activa' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Check if bid is higher than current price
    if (amount <= parseFloat(machine.current_price)) {
      return new Response(JSON.stringify({ 
        error: `La puja debe ser mayor a $${parseFloat(machine.current_price).toLocaleString()}` 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Create bid
    const result = await sql`
      INSERT INTO bids (machine_id, user_id, amount) 
      VALUES (${machine_id}, ${decoded.userId}, ${amount})
      RETURNING id
    `;

    // Update machine current price
    await sql`
      UPDATE machines SET current_price = ${amount} WHERE id = ${machine_id}
    `;

    return new Response(JSON.stringify({ 
      success: true,
      message: 'Puja realizada exitosamente',
      bidId: result[0].id,
      newPrice: amount
    }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Create bid error:', error);
    return new Response(JSON.stringify({ error: 'Error interno del servidor' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

export async function GET({ url }) {
  try {
    const machineId = url.searchParams.get('machine_id');
    
    if (!machineId) {
      return new Response(JSON.stringify({ error: 'ID de máquina requerido' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const bids = await sql`
      SELECT b.*, u.name as user_name, u.phone as user_phone 
      FROM bids b 
      JOIN users u ON b.user_id = u.id 
      WHERE b.machine_id = ${machineId}
      ORDER BY b.amount DESC, b.created_at ASC
    `;
    
    return new Response(JSON.stringify({ 
      success: true,
      bids 
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Get bids error:', error);
    return new Response(JSON.stringify({ error: 'Error interno del servidor' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

