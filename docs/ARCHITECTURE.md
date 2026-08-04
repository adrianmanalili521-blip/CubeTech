# Architecture Overview

## Frontend

The frontend is a React + TypeScript application built with Vite. It uses React Router for route-based navigation and context providers for authentication and cart state.

### Main areas

- Home and storefront pages for browsing products and discovering collections
- Product detail and cart views for shopping flow
- Checkout and order history pages for customers
- Admin pages for managing products, categories, orders, and customers

## Backend

The backend is a lightweight Express server that uses better-sqlite3 to interact with a local SQLite database.

### Responsibilities

- serve product and category data to the frontend
- handle authentication and profile updates
- manage checkout and inventory updates
- expose admin-only endpoints for reporting and management

## Data Model

The database includes tables for:

- products
- categories
- orders
- order_items
- users

## Runtime Flow

1. The frontend loads products from the backend API.
2. Users can add items to the cart and place an order.
3. Checkout writes an order and decrements stock for the purchased products.
4. Admin users can review stats, update orders, and manage catalog content from the dashboard.
