# CubeTech

CubeTech is a full-stack electronics e-commerce application with a React and TypeScript storefront, an Express backend, and a SQLite database. The project supports browsing products, managing a cart, placing orders, and using an admin dashboard for catalog and order management.

## Project Structure

- front-end: Vite + React + TypeScript storefront and admin UI
- back-end: Express + SQLite API server
- docs: setup guides, API reference, and architecture notes

## Features

- Product browsing with category-based views
- Product detail pages and shopping cart flow
- Checkout and order history for customers
- Admin dashboard for products, categories, orders, and customers
- Default seeded admin account for initial testing

## Default Admin Credentials

- Email: admin
- Password: 123

Use these credentials to sign in and access the admin dashboard at /admin.

## Quick Start

### 1. Install dependencies

```bash
cd front-end
npm install

cd ../back-end
npm install
```

### 2. Start the backend

```bash
cd back-end
npm run dev
```

### 3. Start the frontend

```bash
cd front-end
npm run dev
```

The app is available at:

- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

## Documentation

See the docs folder for more detailed guidance:

- [docs/SETUP.md](docs/SETUP.md)
- [docs/API.md](docs/API.md)
- [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)
- [docs/CONTRIBUTING.md](docs/CONTRIBUTING.md)

## Build

To build the frontend for production:

```bash
cd front-end
npm run build
```
