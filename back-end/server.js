import express from 'express';
import cors from 'cors';
import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const PORT = process.env.PORT || 5000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());

const dbPath = path.join(__dirname, 'database.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Database connection error:', err.message);
    process.exit(1);
  }
  console.log('Connected to the SQLite database successfully.');
  initializeDatabase();
});

function initializeDatabase() {
  db.serialize(() => {
    db.run(
      `CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        category TEXT NOT NULL,
        description TEXT NOT NULL,
        price REAL NOT NULL,
        qty INTEGER NOT NULL DEFAULT 0,
        image TEXT,
        overview TEXT
      )`
    );

    db.get('SELECT COUNT(*) AS count FROM products', [], (err, row) => {
      if (err) {
        console.error('Count query failed:', err.message);
        return;
      }

      if (row.count > 0) {
        return;
      }

      const products = [
        {
          name: 'Nebula Pro Smartphone',
          category: 'Smartphone',
          description: 'Flagship performance with AI camera and 5G.',
          price: 899,
          qty: 23,
          image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80',
          overview: 'The Nebula Pro Smartphone redefines flagship performance with advanced hardware integration and a state-of-the-art camera system.',
        },
        {
          name: 'Vapor Pro Laptop',
          category: 'Laptop',
          description: 'Ultra-light powerhouse for creators and professionals.',
          price: 1299,
          qty: 11,
          image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80',
          overview: 'Engineered for ultimate productivity on the move, the Vapor Pro Laptop combines an elegant lightweight chassis with raw computing power.',
        },
        {
          name: 'Beat Studio Headphones',
          category: 'Audio',
          description: 'Immersive sound with active noise cancellation.',
          price: 249,
          qty: 40,
          image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80',
          overview: 'Escape into your own world with hybrid noise cancellation and premium audio tuning for long listening sessions.',
        },
        {
          name: 'Chrono Smartwatch',
          category: 'Watch',
          description: 'Fitness tracking and elegant design in one.',
          price: 349,
          qty: 34,
          image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80',
          overview: 'The Chrono Smartwatch delivers stylish wellness tracking, smart notifications, and all-day performance in a polished design.',
        },
        {
          name: 'ROG Gaming Mouse',
          category: 'Gaming',
          description: 'Precision tracking built for competitive play.',
          price: 129,
          qty: 52,
          image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80',
          overview: 'Dominate the competitive ladder with ultra-responsive precision and programmable controls for every grip style.',
        },
        {
          name: 'ROG Earbuds',
          category: 'Audio',
          description: 'Rich sound and seamless portability.',
          price: 179,
          qty: 17,
          image: 'https://images.unsplash.com/photo-1511367461989-f85a21fda167?auto=format&fit=crop&w=800&q=80',
          overview: 'Designed for non-stop lifestyles, the ROG Earbuds deliver low-latency audio, powerful bass, and secure comfort.',
        },
        {
          name: 'ROG Laptop',
          category: 'Laptop',
          description: 'High performance laptop tailored for gaming and work.',
          price: 1599,
          qty: 17,
          image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80',
          overview: 'A beast crafted for hardcore gamers and creators with top-tier graphics and efficient cooling.',
        },
        {
          name: 'ASUS Monitor',
          category: 'Display',
          description: 'Crisp visuals with vibrant color and sharp detail.',
          price: 399,
          qty: 25,
          image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80',
          overview: 'This premium ASUS Monitor offers incredible clarity, vibrant color, and wide viewing angles for work and entertainment.',
        },
        {
          name: 'Ankeri Wireless Charger',
          category: 'Accessory',
          description: 'Fast wireless charging with a premium finish.',
          price: 69,
          qty: 67,
          image: 'https://images.unsplash.com/photo-1519241047957-be31d7379a5d?auto=format&fit=crop&w=800&q=80',
          overview: 'Declutter your desk with a premium wireless charging surface engineered for speed and safety.',
        },
        {
          name: 'Red Dragon Gamepad',
          category: 'Gaming',
          description: 'Comfortable control for console and PC gaming.',
          price: 89,
          qty: 27,
          image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80',
          overview: 'Experience fluid control with ergonomic design, responsive sticks, and versatile connectivity for gaming anywhere.',
        },
      ];

      const insert = db.prepare(
        `INSERT INTO products (name, category, description, price, qty, image, overview) VALUES (?, ?, ?, ?, ?, ?, ?)`
      );

      products.forEach((product) => {
        insert.run(
          product.name,
          product.category,
          product.description,
          product.price,
          product.qty,
          product.image,
          product.overview
        );
      });

      insert.finalize();
    });
  });
}

app.get('/api/products', (req, res) => {
  const params = [];
  let query = 'SELECT * FROM products';

  if (req.query.category) {
    query += ' WHERE LOWER(category) = LOWER(?)';
    params.push(req.query.category);
  }

  if (typeof req.query.limit !== 'undefined') {
    query += ' LIMIT ?';
    params.push(Number(req.query.limit));
  }

  db.all(query, params, (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

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

app.listen(PORT, () => {
  console.log(`Express server running smoothly on http://localhost:${PORT}`);
});
