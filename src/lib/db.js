import { neon } from '@neondatabase/serverless';

export const sql = neon(process.env.NETLIFY_DATABASE_URL);

// Initialize database tables
export async function initializeDatabase() {
  try {
    // Create users table
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        phone TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Create machines table (renamed from products for consistency)
    await sql`
      CREATE TABLE IF NOT EXISTS machines (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT,
        image_url TEXT,
        initial_price DECIMAL(10,2) NOT NULL,
        current_price DECIMAL(10,2) NOT NULL,
        status TEXT DEFAULT 'active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        ends_at TIMESTAMP
      )
    `;

    // Create products table for API compatibility
    await sql`
      CREATE TABLE IF NOT EXISTS products (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT,
        price DECIMAL(10,2) NOT NULL,
        status TEXT DEFAULT 'active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Create bids table
    await sql`
      CREATE TABLE IF NOT EXISTS bids (
        id SERIAL PRIMARY KEY,
        machine_id INTEGER NOT NULL,
        user_id INTEGER NOT NULL,
        amount DECIMAL(10,2) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (machine_id) REFERENCES machines (id),
        FOREIGN KEY (user_id) REFERENCES users (id)
      )
    `;

    // Create admin_users table
    await sql`
      CREATE TABLE IF NOT EXISTS admin_users (
        id SERIAL PRIMARY KEY,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    console.log('Database tables initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
  }
}

// Seed initial data
export async function seedDatabase() {
  try {
    // Check if admin user exists
    const adminExists = await sql`
      SELECT COUNT(*) as count FROM admin_users WHERE username = 'admin'
    `;
    
    if (adminExists[0].count === '0') {
      await sql`
        INSERT INTO admin_users (username, password) 
        VALUES ('admin', 'admin123')
      `;
      console.log('Admin user created');
    }

    // Check if test user exists
    const userExists = await sql`
      SELECT COUNT(*) as count FROM users WHERE phone = '5551234567'
    `;
    
    if (userExists[0].count === '0') {
      await sql`
        INSERT INTO users (name, phone, password) 
        VALUES ('Usuario de Prueba', '5551234567', '$2a$10$example.hash.for.testing')
      `;
      console.log('Test user created');
    }

    // Check if machines exist
    const machinesExist = await sql`
      SELECT COUNT(*) as count FROM machines
    `;
    
    if (machinesExist[0].count === '0') {
      await sql`
        INSERT INTO machines (name, description, image_url, initial_price, current_price) VALUES
        ('Centro de Maquinado CNC Haas VF-2', 'Centro de maquinado vertical de alta precisión con control Haas. Ideal para producción de piezas complejas.', '/images/machining_center_1.jpg', 85000, 85000),
        ('Torno CNC Mazak Quick Turn 200', 'Torno CNC compacto con capacidades de torneado y fresado. Perfecto para piezas de revolución.', '/images/cnc_lathe_1.jpg', 65000, 67500),
        ('Fresadora Universal Bridgeport', 'Fresadora manual de alta calidad con mesa de trabajo amplia. Excelente para trabajos de precisión.', '/images/milling_machine_1.jpg', 25000, 25000),
        ('Centro de Maquinado DMG Mori', 'Centro de maquinado de 5 ejes con tecnología avanzada. Ideal para industria aeroespacial.', '/images/machining_center_2.jpg', 120000, 125000)
      `;
      console.log('Test machines created');
    }

    // Check if products exist
    const productsExist = await sql`
      SELECT COUNT(*) as count FROM products
    `;
    
    if (productsExist[0].count === '0') {
      await sql`
        INSERT INTO products (name, description, price) VALUES
        ('Centro de Maquinado CNC', 'Centro de maquinado vertical de alta precisión', 85000),
        ('Torno CNC Industrial', 'Torno CNC para producción industrial', 65000),
        ('Fresadora Universal', 'Fresadora manual de alta calidad', 25000),
        ('Centro de Maquinado 5 Ejes', 'Centro de maquinado avanzado de 5 ejes', 120000)
      `;
      console.log('Test products created');
    }

    console.log('Database seeded successfully');
  } catch (error) {
    console.error('Error seeding database:', error);
  }
}