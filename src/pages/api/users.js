import { sql } from '../../lib/db.js';

export async function GET() {
  try {
    const users = await sql`
      SELECT id, name, phone, created_at 
      FROM users 
      ORDER BY created_at DESC
    `;
    
    return new Response(JSON.stringify({ 
      success: true,
      users 
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Get users error:', error);
    return new Response(JSON.stringify({ 
      success: false,
      error: 'Error interno del servidor' 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}