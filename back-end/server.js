import express from 'express';
import cors from 'cors';
import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const PORT = 5000;

// Resolve absolute directory paths for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware configurations
app.use(cors());         // Allows your React frontend to securely request data
app.use(express.json()); // Allows Express to parse JSON data sent in request bodies

// Connect to SQLite Database (creates database.db automatically if missing)
const dbPath = path.join(__dirname, 'database.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Database connection error:', err.message);
  } else {
    console.log('Connected to the SQLite database successfully.');
    initializeDatabase();
  }
});

// Seed an initial table matching your exact product schema
function initializeDatabase() {
  db.run(`
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      category TEXT NOT NULL,
      description TEXT NOT NULL,
      price REAL NOT NULL,
      qty INTEGER DEFAULT 0,
      image TEXT,
      overview TEXT
    )
  `, (err) => {
    if (err) {
      console.error('Table creation error:', err.message);
    } else {
      // Check if the table is empty; if so, insert your real data records
      db.get('SELECT COUNT(*) as count FROM products', [], (err, row) => {
        if (!err && row.count === 0) {
          db.run(`
            INSERT INTO products (name, category, description, price, qty, image, overview)
            VALUES (?, ?, ?, ?, ?, ?, ?)
          `, [
            "Nebula Pro Smartphone", 
            "Smartphone", 
            "Flagship performance with AI camera and 5G.",
            899, 
            23, 
            "/images/nebula.jpg", // Store your product images inside the frontend /public folder
            "The Nebula Pro Smartphone redefines flagship performance with advanced hardware integration and a state-of-the-art camera system."
          ]);
        }
      });
    }
  });
}

// ---- API ENDPOINTS ----

// 1. GET Route: Fetch all products
app.get('/api/products', (req, res) => {
  db.all('SELECT * FROM products', [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// 2. GET Route: Fetch a single product by ID (for your product detail page)
app.get('/api/products/:id', (req, res) => {
  const { id } = req.params;
  db.get('SELECT * FROM products WHERE id = ?', [id], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (!row) {
      res.status(404).json({ message: 'Product not found' });
      return;
    }
    res.json(row);
  });
});

// Start the Express Server Listener
app.listen(PORT, () => {
  console.log(`Express server running smoothly on http://localhost:${PORT}`);
});
