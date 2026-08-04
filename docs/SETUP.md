# Setup Guide

## Prerequisites

Make sure you have Node.js installed on your machine before starting.

## Install Dependencies

From the project root, install dependencies in both apps:

```bash
cd front-end
npm install

cd ../back-end
npm install
```

## Run the Project

Start the backend API first:

```bash
cd back-end
npm run dev
```

The API runs on http://localhost:5000.

Then start the frontend in a second terminal:

```bash
cd front-end
npm run dev
```

The storefront runs on http://localhost:5173.

## Default Admin Account

The backend seeds a default admin user when the database is initialized.

- Email: admin
- Password: 123

Use these credentials to sign in and access the admin dashboard at /admin.

## Build for Production

```bash
cd front-end
npm run build
```

## Troubleshooting

- If the frontend cannot reach the API, confirm that the backend is running on port 5000.
- If the database is missing data, the backend will recreate the SQLite database and seed starter products on startup.
- If you change ports, update the CORS settings in the backend server file and the frontend API calls as needed.
