import express from 'express';
import cors from 'cors';
import Database from 'better-sqlite3'; // Modern, fast SQLite driver
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const PORT = process.env.PORT || 5000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(
  cors({
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
  }),
)
app.use(express.json());

// Connect to SQLite Database
const dbPath = path.join(__dirname, 'database.db');
let db;

try {
  db = new Database(dbPath);
  console.log('Connected to the SQLite database successfully.');
  initializeDatabase();
} catch (err) {
  console.error('Database connection error:', err.message);
  process.exit(1);
}

function initializeDatabase() {
  // 1. Create the table structure cleanly
  db.prepare(`
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      category TEXT NOT NULL,
      description TEXT NOT NULL,
      price REAL NOT NULL,
      qty INTEGER NOT NULL DEFAULT 0,
      image TEXT,
      overview TEXT,
      status TEXT NOT NULL DEFAULT 'Active'
    )
  `).run();

  const productColumns = db.prepare("PRAGMA table_info('products')").all();
  const hasStatusColumn = productColumns.some((column) => column.name === 'status');
  if (!hasStatusColumn) {
    db.prepare("ALTER TABLE products ADD COLUMN status TEXT NOT NULL DEFAULT 'Active'").run();
  }

  db.prepare(`
    CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE
    )
  `).run();

  db.prepare(`
    CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      orderNumber TEXT NOT NULL UNIQUE,
      customerUserId INTEGER,
      customerName TEXT NOT NULL,
      customerEmail TEXT NOT NULL,
      customerPhone TEXT,
      customerAddress TEXT,
      customerCity TEXT,
      customerPostalCode TEXT,
      customerCountry TEXT,
      paymentMethod TEXT,
      status TEXT NOT NULL DEFAULT 'Pending',
      notes TEXT,
      total REAL NOT NULL,
      createdAt TEXT NOT NULL,
      FOREIGN KEY (customerUserId) REFERENCES users(id)
    )
  `).run();

  db.prepare(`
    CREATE TABLE IF NOT EXISTS order_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      orderId INTEGER NOT NULL,
      productId INTEGER NOT NULL,
      productName TEXT NOT NULL,
      quantity INTEGER NOT NULL,
      price REAL NOT NULL,
      total REAL NOT NULL,
      FOREIGN KEY (orderId) REFERENCES orders(id),
      FOREIGN KEY (productId) REFERENCES products(id)
    )
  `).run();

  db.prepare(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      phone TEXT,
      address TEXT,
      city TEXT,
      postalCode TEXT,
      country TEXT,
      paymentMethod TEXT,
      isAdmin INTEGER NOT NULL DEFAULT 0
    )
  `).run();

  const userColumns = db.prepare("PRAGMA table_info('users')").all();
  const hasPaymentMethodColumn = userColumns.some((column) => column.name === 'paymentMethod');
  if (!hasPaymentMethodColumn) {
    db.prepare('ALTER TABLE users ADD COLUMN paymentMethod TEXT').run();
  }
  const hasIsAdminColumn = userColumns.some((column) => column.name === 'isAdmin');
  if (!hasIsAdminColumn) {
    db.prepare('ALTER TABLE users ADD COLUMN isAdmin INTEGER NOT NULL DEFAULT 0').run();
  }

  const existingAdmin = db.prepare('SELECT id FROM users WHERE email = ?').get('admin');
  if (!existingAdmin) {
    db.prepare('INSERT INTO users (name, email, password, isAdmin) VALUES (?, ?, ?, ?)').run('admin', 'admin', '123', 1);
  }

  // Helper function to patch older absolute image string records safely
  function normalizeProductImagePaths() {
    const pathMap = [
      ['Nebula Pro Smartphone', '/images/nebula.jpeg'],
      ['Vapor Pro Laptop', '/images/vapor-pro.jpeg'],
      ['Beat Studio Headphones', '/images/beat%20studio.jpeg'],
      ['Chrono Smartwatch', '/images/chrono%20smartwatch.png'],
      ['ROG Gaming Mouse', '/images/ROG%20mouse.png'],
      ['ROG Earbuds', '/images/ROG-earbuds.jpeg'],
      ['ROG Laptop', '/images/ROG-laptop.jpeg'],
      ['ASUS Monitor', '/images/ASUS-monitor.jpeg'],
      ['Ankeri Wireless Charger', '/images/Ankeri-wireless-charger.jpg'],
      ['Red Dragon Gamepad', '/images/red-dragon-gamepad.jpeg'],
    ];

    const updateStmt = db.prepare('UPDATE products SET image = ? WHERE name = ?');
    for (const [newPath, name] of pathMap) {
      updateStmt.run(newPath, name);
    }
  }

  // 2. Check if records exist
  const row = db.prepare('SELECT COUNT(*) AS count FROM products').get();

  if (row && row.count > 0) {
    console.log(`Database already has ${row.count} products. Skipping seeding.`);
    normalizeProductImagePaths();
    return;
  }

  console.log('Seeding initial products into database...');

  const products = [
    {
      name: 'Nebula Pro Smartphone',
      category: 'Smartphone',
      description: 'Flagship performance with AI camera and 5G.',
      price: 899,
      qty: 23,
      image: '/images/nebula.jpeg',
      overview: 'The Nebula Pro Smartphone redefines flagship performance with advanced hardware integration and a state-of-the-art camera system.',
    },
    {
      name: 'Vapor Pro Laptop',
      category: 'Laptop',
      description: 'Ultra-light powerhouse for creators and professionals.',
      price: 1299,
      qty: 11,
      image: '/images/vapor-pro.jpeg',
      overview: 'Engineered for ultimate productivity on the move, the Vapor Pro Laptop combines an elegant lightweight chassis with raw computing power.',
    },
    {
      name: 'Beat Studio Headphones',
      category: 'Audio',
      description: 'Immersive sound with active noise cancellation.',
      price: 249,
      qty: 40,
      image: '/images/beat%20studio.jpeg',
      overview: 'Escape into your own world with hybrid noise cancellation and premium audio tuning for long listening sessions.',
    },
    {
      name: 'Chrono Smartwatch',
      category: 'Watch',
      description: 'Fitness tracking and elegant design in one.',
      price: 349,
      qty: 34,
      image: '/images/chrono%20smartwatch.png',
      overview: 'The Chrono Smartwatch delivers stylish wellness tracking, smart notifications, and all-day performance in a polished design.',
    },
    {
      name: 'ROG Gaming Mouse',
      category: 'Gaming',
      description: 'Precision tracking built for competitive play.',
      price: 129,
      qty: 52,
      image: '/images/ROG%20mouse.png',
      overview: 'Dominate the competitive ladder with ultra-responsive precision and programmable controls for every grip style.',
    },
    {
      name: 'ROG Earbuds',
      category: 'Audio',
      description: 'Rich sound and seamless portability.',
      price: 179,
      qty: 17,
      image: '/images/ROG-earbuds.jpeg',
      overview: 'Designed for non-stop lifestyles, the ROG Earbuds deliver low-latency audio, powerful bass, and secure comfort.',
    },
    {
      name: 'ROG Laptop',
      category: 'Laptop',
      description: 'High performance laptop tailored for gaming and work.',
      price: 1599,
      qty: 17,
      image: '/images/ROG-laptop.jpeg',
      overview: 'A beast crafted for hardcore gamers and creators with top-tier graphics and efficient cooling.',
    },
    {
      name: 'ASUS Monitor',
      category: 'Display',
      description: 'Crisp visuals with vibrant color and sharp detail.',
      price: 399,
      qty: 25,
      image: '/images/ASUS-monitor.jpeg',
      overview: 'This premium ASUS Monitor offers incredible clarity, vibrant color, and wide viewing angles for work and entertainment.',
    },
    {
      name: 'Ankeri Wireless Charger',
      category: 'Accessory',
      description: 'Fast wireless charging with a premium finish.',
      price: 69,
      qty: 67,
      image: '/images/Ankeri-wireless-charger.jpg',
      overview: 'Declutter your desk with a premium wireless charging surface engineered for speed and safety.',
    },
    {
      name: 'Red Dragon Gamepad',
      category: 'Gaming',
      description: 'Comfortable control for console and PC gaming.',
      price: 89,
      qty: 27,
      image: '/images/red-dragon-gamepad.jpeg',
      overview: 'Experience fluid control with ergonomic design, responsive sticks, and versatile connectivity for gaming anywhere.',
    }
  ];

  // 3. Multi-row seed execution block
  const insert = db.prepare(
    `INSERT INTO products (name, category, description, price, qty, image, overview) VALUES (?, ?, ?, ?, ?, ?, ?)`
  );

  // Run transactions smoothly under the hood
  const transaction = db.transaction((items) => {
    for (const item of items) {
      insert.run(item.name, item.category, item.description, item.price, item.qty, item.image, item.overview);
    }
  });

  transaction(products);
  console.log('All 10 products successfully seeded into SQLite.');
}

// ---- API ENDPOINTS ----

// 1. GET ALL PRODUCTS
app.get('/api/products', (req, res) => {
  try {
    const includeInactive = req.query.includeInactive === 'true';
    const categoryFilter = req.query.category;
    let query = 'SELECT * FROM products';
    const params = [];
    const filters = [];

    if (!includeInactive) {
      filters.push("status = 'Active'");
    }

    if (categoryFilter) {
      filters.push('LOWER(category) = LOWER(?)');
      params.push(categoryFilter);
    }

    if (filters.length > 0) {
      query += ` WHERE ${filters.join(' AND ')}`;
    }

    if (typeof req.query.limit !== 'undefined') {
      query += ' LIMIT ?';
      params.push(Number(req.query.limit));
    }

    const rows = db.prepare(query).all(params);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 2. GET SINGLE PRODUCT BY ID
app.get('/api/products/:id', (req, res) => {
  try {
    const { id } = req.params;
    const row = db.prepare('SELECT * FROM products WHERE id = ?').get(id);

    if (!row) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(row);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 3. USER SIGNUP
app.post('/api/signup', (req, res) => {
  try {
    const { name, email, password, phone, address, city, postalCode, country, paymentMethod } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required.' });
    }

    const existingUser = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
    if (existingUser) {
      return res.status(400).json({ error: 'This email is already registered.' });
    }

    const insert = db.prepare(
      'INSERT INTO users (name, email, password, phone, address, city, postalCode, country, paymentMethod) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)'
    );
    const result = insert.run(
      name,
      email,
      password,
      phone || null,
      address || null,
      city || null,
      postalCode || null,
      country || null,
      paymentMethod || null,
    );

    res.json({ id: result.lastInsertRowid, name, email, phone, address, city, postalCode, country, paymentMethod });
  } catch (err) {
    res.status(500).json({ error: err instanceof Error ? err.message : 'Unable to create user.' });
  }
});

// 4. USER LOGIN
app.post('/api/login', (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    const user = db.prepare('SELECT id, name, email, phone, address, city, postalCode, country, paymentMethod, isAdmin FROM users WHERE email = ? AND password = ?').get(email, password);

    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err instanceof Error ? err.message : 'Unable to log in.' });
  }
});

// 5. UPDATE USER PROFILE
app.put('/api/user', (req, res) => {
  try {
    const { currentEmail, name, email, phone, address, city, postalCode, country, paymentMethod } = req.body;

    if (!currentEmail) {
      return res.status(400).json({ error: 'Current email is required to update the profile.' });
    }

    const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(currentEmail);
    if (!existing) {
      return res.status(404).json({ error: 'User not found.' });
    }

    const emailToUpdate = email || currentEmail;
    const update = db.prepare(
      'UPDATE users SET name = ?, email = ?, phone = ?, address = ?, city = ?, postalCode = ?, country = ?, paymentMethod = ? WHERE email = ?'
    );

    update.run(
      name || null,
      emailToUpdate,
      phone || null,
      address || null,
      city || null,
      postalCode || null,
      country || null,
      paymentMethod || null,
      currentEmail,
    );

    const updatedUser = db.prepare('SELECT id, name, email, phone, address, city, postalCode, country, paymentMethod FROM users WHERE email = ?').get(emailToUpdate);
    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ error: err instanceof Error ? err.message : 'Unable to update user.' });
  }
});

function generateOrderNumber() {
  const now = new Date();
  return `ORD-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
}

// 6. PLACE CHECKOUT ORDER
app.post('/api/checkout', (req, res) => {
  try {
    const { customer, items } = req.body;

    if (!customer || typeof customer !== 'object') {
      return res.status(400).json({ error: 'Customer information is required for checkout.' });
    }

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'No items provided for checkout.' });
    }

    const getProductStmt = db.prepare('SELECT id, qty, name, price FROM products WHERE id = ?');
    const updateQtyStmt = db.prepare('UPDATE products SET qty = qty - ? WHERE id = ?');

    const orderSummary = [];
    const transaction = db.transaction((orderItems) => {
      for (const orderItem of orderItems) {
        if (typeof orderItem.id !== 'number' || typeof orderItem.quantity !== 'number') {
          throw new Error('Invalid order item data.');
        }

        const product = getProductStmt.get(orderItem.id);
        if (!product) {
          throw new Error(`Product with id ${orderItem.id} not found.`);
        }

        if (product.qty < orderItem.quantity) {
          throw new Error(`Not enough stock for product id ${orderItem.id}.`);
        }

        updateQtyStmt.run(orderItem.quantity, orderItem.id);

        orderSummary.push({
          id: product.id,
          name: product.name,
          quantity: orderItem.quantity,
          price: product.price,
          total: product.price * orderItem.quantity,
        });
      }
    });

    transaction(items);

    const orderNumber = generateOrderNumber();
    const totalAmount = orderSummary.reduce((sum, item) => sum + item.total, 0);
    const customerUser = db.prepare('SELECT id FROM users WHERE email = ?').get(customer.email);

    const insertOrder = db.prepare(
      `INSERT INTO orders (orderNumber, customerUserId, customerName, customerEmail, customerPhone, customerAddress, customerCity, customerPostalCode, customerCountry, paymentMethod, status, notes, total, createdAt)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    );

    const result = insertOrder.run(
      orderNumber,
      customerUser?.id || null,
      customer.name,
      customer.email,
      customer.phone || null,
      customer.address || null,
      customer.city || null,
      customer.postalCode || null,
      customer.country || null,
      customer.paymentMethod || null,
      'Pending',
      null,
      totalAmount,
      new Date().toISOString(),
    );

    const orderId = result.lastInsertRowid;
    const insertOrderItem = db.prepare(
      `INSERT INTO order_items (orderId, productId, productName, quantity, price, total) VALUES (?, ?, ?, ?, ?, ?)`
    );

    const orderItemsTransaction = db.transaction((orderItems) => {
      for (const item of orderItems) {
        insertOrderItem.run(orderId, item.id, item.name, item.quantity, item.price, item.total);
      }
    });

    orderItemsTransaction(orderSummary);

    res.json({
      success: true,
      message: 'Order placed successfully.',
      orderNumber,
      orderSummary,
      total: totalAmount,
      customer,
    });
  } catch (err) {
    res.status(400).json({ error: err instanceof Error ? err.message : 'Unable to place order.' });
  }
});

app.get('/api/orders', (req, res) => {
  try {
    const email = req.query.email;
    if (!email || typeof email !== 'string') {
      return res.status(400).json({ error: 'Customer email is required.' });
    }
    const rows = db.prepare('SELECT id, orderNumber, customerName, createdAt, total, paymentMethod, status FROM orders WHERE customerEmail = ? ORDER BY createdAt DESC').all(email);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err instanceof Error ? err.message : 'Unable to load orders.' });
  }
});

app.get('/api/categories', (req, res) => {
  try {
    const rows = db.prepare('SELECT * FROM categories ORDER BY name').all();
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/categories/:id', (req, res) => {
  try {
    const { id } = req.params;
    const category = db.prepare('SELECT * FROM categories WHERE id = ?').get(id);
    if (!category) {
      return res.status(404).json({ error: 'Category not found.' });
    }
    res.json(category);
  } catch (err) {
    res.status(500).json({ error: err instanceof Error ? err.message : 'Unable to load category.' });
  }
});

app.post('/api/categories', (req, res) => {
  try {
    const { name } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({ error: 'Category name is required.' });
    }
    const existing = db.prepare('SELECT id FROM categories WHERE LOWER(name) = LOWER(?)').get(name.trim());
    if (existing) {
      return res.status(400).json({ error: 'Category already exists.' });
    }
    const result = db.prepare('INSERT INTO categories (name) VALUES (?)').run(name.trim());
    res.json({ id: result.lastInsertRowid, name: name.trim() });
  } catch (err) {
    res.status(500).json({ error: err instanceof Error ? err.message : 'Unable to create category.' });
  }
});

app.put('/api/categories/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({ error: 'Category name is required.' });
    }
    const existing = db.prepare('SELECT id FROM categories WHERE id = ?').get(id);
    if (!existing) {
      return res.status(404).json({ error: 'Category not found.' });
    }
    db.prepare('UPDATE categories SET name = ? WHERE id = ?').run(name.trim(), id);
    res.json({ id: Number(id), name: name.trim() });
  } catch (err) {
    res.status(500).json({ error: err instanceof Error ? err.message : 'Unable to update category.' });
  }
});

app.delete('/api/categories/:id', (req, res) => {
  try {
    const { id } = req.params;
    const productsUsingCategory = db.prepare('SELECT COUNT(*) AS count FROM products WHERE LOWER(category) = LOWER((SELECT name FROM categories WHERE id = ?))').get(id);
    if (productsUsingCategory && productsUsingCategory.count > 0) {
      return res.status(400).json({ error: 'Category is assigned to existing products and cannot be deleted.' });
    }
    const result = db.prepare('DELETE FROM categories WHERE id = ?').run(id);
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Category not found.' });
    }
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err instanceof Error ? err.message : 'Unable to delete category.' });
  }
});

app.post('/api/products', (req, res) => {
  try {
    const { name, category, description, price, qty, image, overview, status } = req.body;
    if (!name || !category || !description || typeof price !== 'number' || typeof qty !== 'number') {
      return res.status(400).json({ error: 'Missing required product fields.' });
    }
    const result = db.prepare(
      'INSERT INTO products (name, category, description, price, qty, image, overview, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
    ).run(name.trim(), category.trim(), description.trim(), price, qty, image || '', overview || '', status || 'Active');
    const product = db.prepare('SELECT * FROM products WHERE id = ?').get(result.lastInsertRowid);
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err instanceof Error ? err.message : 'Unable to create product.' });
  }
});

app.put('/api/products/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { name, category, description, price, qty, image, overview, status } = req.body;
    const existing = db.prepare('SELECT id FROM products WHERE id = ?').get(id);
    if (!existing) {
      return res.status(404).json({ error: 'Product not found.' });
    }
    db.prepare(
      'UPDATE products SET name = ?, category = ?, description = ?, price = ?, qty = ?, image = ?, overview = ?, status = ? WHERE id = ?'
    ).run(name.trim(), category.trim(), description.trim(), price, qty, image || '', overview || '', status || 'Active', id);
    const product = db.prepare('SELECT * FROM products WHERE id = ?').get(id);
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err instanceof Error ? err.message : 'Unable to update product.' });
  }
});

app.delete('/api/products/:id', (req, res) => {
  try {
    const { id } = req.params;
    const result = db.prepare('DELETE FROM products WHERE id = ?').run(id);
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Product not found.' });
    }
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err instanceof Error ? err.message : 'Unable to delete product.' });
  }
});

app.get('/api/admin/stats', (req, res) => {
  try {
    const totalProducts = db.prepare("SELECT COUNT(*) AS count FROM products").get().count;
    const totalOrders = db.prepare("SELECT COUNT(*) AS count FROM orders").get().count;
    const pendingOrders = db.prepare("SELECT COUNT(*) AS count FROM orders WHERE status = 'Pending'").get().count;
    const completedOrders = db.prepare("SELECT COUNT(*) AS count FROM orders WHERE status = 'Completed'").get().count;
    const totalCustomers = db.prepare("SELECT COUNT(*) AS count FROM users WHERE isAdmin = 0").get().count;
    const totalSales = db.prepare('SELECT COALESCE(SUM(total),0) AS sum FROM orders').get().sum;
    res.json({ totalProducts, totalOrders, pendingOrders, completedOrders, totalCustomers, totalSales });
  } catch (err) {
    res.status(500).json({ error: err instanceof Error ? err.message : 'Unable to load admin stats.' });
  }
});

app.get('/api/admin/orders', (req, res) => {
  try {
    const rows = db.prepare('SELECT id, orderNumber, customerName, createdAt, total, paymentMethod, status FROM orders ORDER BY createdAt DESC').all();
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err instanceof Error ? err.message : 'Unable to load orders.' });
  }
});

app.get('/api/admin/orders/:id', (req, res) => {
  try {
    const { id } = req.params;
    const order = db.prepare('SELECT * FROM orders WHERE id = ?').get(id);
    if (!order) {
      return res.status(404).json({ error: 'Order not found.' });
    }
    const items = db.prepare('SELECT productId, productName, quantity, price, total FROM order_items WHERE orderId = ?').all(id);
    res.json({ ...order, items });
  } catch (err) {
    res.status(500).json({ error: err instanceof Error ? err.message : 'Unable to load order details.' });
  }
});

app.put('/api/admin/orders/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;
    const allowed = ['Pending', 'Confirmed', 'Preparing', 'Shipped', 'Completed', 'Cancelled'];
    if (!allowed.includes(status)) {
      return res.status(400).json({ error: 'Invalid order status.' });
    }
    const existing = db.prepare('SELECT id FROM orders WHERE id = ?').get(id);
    if (!existing) {
      return res.status(404).json({ error: 'Order not found.' });
    }
    db.prepare('UPDATE orders SET status = ?, notes = ? WHERE id = ?').run(status, notes || null, id);
    const order = db.prepare('SELECT * FROM orders WHERE id = ?').get(id);
    const items = db.prepare('SELECT productId, productName, quantity, price, total FROM order_items WHERE orderId = ?').all(id);
    res.json({ ...order, items });
  } catch (err) {
    res.status(500).json({ error: err instanceof Error ? err.message : 'Unable to update order.' });
  }
});

app.get('/api/admin/customers', (req, res) => {
  try {
    const rows = db.prepare(
      `SELECT u.id, u.name, u.email, u.phone, COUNT(o.id) AS orderCount, COALESCE(SUM(o.total), 0) AS totalPurchase
       FROM users u
       LEFT JOIN orders o ON o.customerUserId = u.id
       WHERE u.isAdmin = 0
       GROUP BY u.id
       ORDER BY u.name`
    ).all();
    const mapped = rows.map((row) => ({
      ...row,
      status: 'Active',
      totalPurchase: Number(row.totalPurchase),
      orderCount: Number(row.orderCount),
    }));
    res.json(mapped);
  } catch (err) {
    res.status(500).json({ error: err instanceof Error ? err.message : 'Unable to load customers.' });
  }
});

app.listen(PORT, () => {
  console.log(`Express server running smoothly on http://localhost:${PORT}`);
});
