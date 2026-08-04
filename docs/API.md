# API Reference

The backend exposes a REST-style API that powers the storefront and administrator tools.

## Product Endpoints

- GET /api/products – list products, optionally filter by category or status.
- GET /api/products/:id – fetch a single product.
- POST /api/products – create a product (admin flow).
- PUT /api/products/:id – update a product (admin flow).
- DELETE /api/products/:id – remove a product (admin flow).

## Category Endpoints

- GET /api/categories – list all categories.
- GET /api/categories/:id – fetch one category.
- POST /api/categories – create a category (admin flow).
- PUT /api/categories/:id – update a category (admin flow).
- DELETE /api/categories/:id – delete a category when no products use it.

## Authentication Endpoints

- POST /api/signup – create a new customer account.
- POST /api/login – authenticate a user.
- PUT /api/user – update profile information.

## Order Endpoints

- POST /api/checkout – place an order and reduce stock for purchased products.
- GET /api/orders – retrieve an order history for a customer by email.

## Admin Endpoints

- GET /api/admin/stats – fetch summary metrics for the dashboard.
- GET /api/admin/orders – list all orders.
- GET /api/admin/orders/:id – fetch order details and associated items.
- PUT /api/admin/orders/:id – update an order status.
- GET /api/admin/customers – list customer accounts and purchase summaries.

## Notes

- The backend uses SQLite and stores the database in the back-end folder as database.db.
- The API returns JSON and uses simple error messages for invalid input or missing resources.
