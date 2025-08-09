import { sql } from '../../lib/db.js';

export async function GET() {
  try {
    const products = await sql`
      SELECT id, name, description, price, status, created_at 
      FROM products 
      WHERE status = 'active'
      ORDER BY created_at DESC
    `;
    
    return new Response(JSON.stringify({ 
      success: true,
      products 
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Get products error:', error);
    return new Response(JSON.stringify({ 
      success: false,
      error: 'Error interno del servidor' 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}