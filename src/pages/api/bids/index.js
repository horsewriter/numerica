import jwt from 'jsonwebtoken';
import { bidQueries, machineQueries } from '../../../lib/database.js';

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
    const machine = machineQueries.findById.get(machine_id);
    if (!machine) {
      return new Response(JSON.stringify({ error: 'Máquina no encontrada' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (machine.status !== 'active') {
      return new Response(JSON.stringify({ error: 'La subasta no está activa' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Check if bid is higher than current price
    if (amount <= machine.current_price) {
      return new Response(JSON.stringify({ 
        error: `La puja debe ser mayor a $${machine.current_price.toLocaleString()}` 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Create bid
    const result = bidQueries.create.run(machine_id, decoded.userId, amount);

    // Update machine current price
    machineQueries.updatePrice.run(amount, machine_id);

    return new Response(JSON.stringify({ 
      success: true,
      message: 'Puja realizada exitosamente',
      bidId: result.lastInsertRowid,
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

    const bids = bidQueries.findByMachine.all(machineId);
    
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

