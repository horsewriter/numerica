import { initializeDatabase, seedDatabase } from '../../lib/db.js';

export async function GET() {
  try {
    await initializeDatabase();
    await seedDatabase();
    
    return new Response(JSON.stringify({ 
      success: true,
      message: 'Base de datos inicializada y poblada correctamente'
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Database initialization error:', error);
    return new Response(JSON.stringify({ 
      success: false,
      error: 'Error al inicializar la base de datos',
      details: error.message
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}