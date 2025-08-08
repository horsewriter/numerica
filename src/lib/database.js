import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const dbPath = join(__dirname, '../../database.sqlite');
const db = new Database(dbPath);

// Initialize database tables
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    phone TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS machines (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    image_url TEXT,
    initial_price REAL NOT NULL,
    current_price REAL NOT NULL,
    status TEXT DEFAULT 'active',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    ends_at DATETIME
  );

  CREATE TABLE IF NOT EXISTS bids (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    machine_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    amount REAL NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (machine_id) REFERENCES machines (id),
    FOREIGN KEY (user_id) REFERENCES users (id)
  );

  CREATE TABLE IF NOT EXISTS admin_users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

// Insert default admin user (username: admin, password: admin123)
const adminExists = db.prepare('SELECT COUNT(*) as count FROM admin_users WHERE username = ?').get('admin');
if (adminExists.count === 0) {
  db.prepare('INSERT INTO admin_users (username, password) VALUES (?, ?)').run('admin', 'admin123');
}

export default db;

export const userQueries = {
  create: db.prepare('INSERT INTO users (name, phone, password) VALUES (?, ?, ?)'),
  findByPhone: db.prepare('SELECT * FROM users WHERE phone = ?'),
  findById: db.prepare('SELECT * FROM users WHERE id = ?')
};

export const machineQueries = {
  create: db.prepare('INSERT INTO machines (name, description, image_url, initial_price, current_price, ends_at) VALUES (?, ?, ?, ?, ?, ?)'),
  findAll: db.prepare('SELECT * FROM machines WHERE status = ? ORDER BY current_price DESC'),
  findById: db.prepare('SELECT * FROM machines WHERE id = ?'),
  updatePrice: db.prepare('UPDATE machines SET current_price = ? WHERE id = ?'),
  updateStatus: db.prepare('UPDATE machines SET status = ? WHERE id = ?')
};

export const bidQueries = {
  create: db.prepare('INSERT INTO bids (machine_id, user_id, amount) VALUES (?, ?, ?)'),
  findByMachine: db.prepare(`
    SELECT b.*, u.name as user_name, u.phone as user_phone 
    FROM bids b 
    JOIN users u ON b.user_id = u.id 
    WHERE b.machine_id = ? 
    ORDER BY b.amount DESC, b.created_at ASC
  `),
  findHighestBid: db.prepare(`
    SELECT b.*, u.name as user_name 
    FROM bids b 
    JOIN users u ON b.user_id = u.id 
    WHERE b.machine_id = ? 
    ORDER BY b.amount DESC, b.created_at ASC 
    LIMIT 1
  `)
};

export const adminQueries = {
  findByUsername: db.prepare('SELECT * FROM admin_users WHERE username = ?')
};

