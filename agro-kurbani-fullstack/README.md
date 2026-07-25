# Agro Kurbani — Partial Kurbani E-Commerce Platform

A full-stack marketplace where farmers list animals for Kurbani (Qurbani) and
customers buy either a whole animal or a numbered "share" of one (up to 7
shares for a cow/camel, per Islamic tradition). Built to match the SRS: React
frontend, Node/Express + Sequelize backend, MySQL database, JWT auth, and a
mock payment gateway flow (SSLCommerz/Stripe/COD).

This has been tested end-to-end against a real MySQL database and builds
cleanly with Vite — see "Verified" below.

## Structure

```
agro-kurbani/
  backend/     Express API + Sequelize models + MySQL
  frontend/    React (Vite) + Tailwind CSS client
```

## Quick start

### 1. Backend

```bash
cd backend
cp .env.example .env      # then edit DB_USER / DB_PASSWORD / JWT_SECRET
npm install
npm run seed               # creates tables + demo data (drops existing tables!)
npm run dev                 # http://localhost:5000
```

Demo accounts created by the seed script (password for all: `password123`):

| Email                     | Role     |
|----------------------------|----------|
| admin@agrokurbani.com      | admin    |
| karim@farm.com             | farmer   |
| rafiqul@farm.com           | farmer   |
| nusrat@example.com         | customer |

### 2. Frontend

```bash
cd frontend
cp .env.example .env       # VITE_API_URL, defaults to http://localhost:5000/api
npm install
npm run dev                 # http://localhost:5173
```

The Vite dev server also proxies `/api` to `http://localhost:5000`, so the
frontend works even without setting `VITE_API_URL` explicitly in dev.

## Data model

- **users** — customer / farmer / admin, role-based access via JWT
- **animals** — farmer listings; `total_shares` is 1 (sold whole, e.g. goat/sheep)
  or up to 7 (splittable, e.g. cow/camel); `available_shares` decrements on purchase
- **orders** / **order_items** — one order can contain shares from multiple animals
- **shares** — one row per individual numbered share ticket a customer owns
- **payments** — mock gateway record per order

Placing an order runs inside a single Sequelize transaction with row locking,
so two customers can't both claim the last share of the same animal.

## API overview

| Method | Route                    | Auth            | Description |
|--------|---------------------------|-----------------|-------------|
| POST   | /api/auth/register         | —               | Create account (customer/farmer) |
| POST   | /api/auth/login             | —               | Get JWT |
| GET    | /api/auth/profile           | any              | Current user |
| GET    | /api/animals                 | —               | List/filter animals (`?category=`, `?status=`, `?farmerId=`) |
| GET    | /api/animals/:id             | —               | Animal detail |
| POST   | /api/animals                  | farmer/admin    | List a new animal |
| PUT    | /api/animals/:id              | owner/admin     | Edit listing |
| DELETE | /api/animals/:id              | owner/admin     | Remove listing |
| POST   | /api/orders                    | customer/admin  | Place order (buys shares, issues tickets) |
| GET    | /api/orders                     | any              | My orders (customer) |
| GET    | /api/orders/farmer/mine         | farmer           | Orders touching my animals |
| GET    | /api/orders/:id                 | owner/admin     | Order detail |
| PUT    | /api/orders/:id                  | admin            | Update payment/delivery status |
| POST   | /api/payment/create               | any               | Mock gateway session |
| POST   | /api/payment/success / /fail      | gateway callback  | Confirm/fail payment |
| GET    | /api/admin/reports                 | admin             | Totals: users, animals, orders, revenue |
| GET    | /api/admin/users / /api/admin/orders | admin        | Full listings |

## Verified

- `npm run seed` runs cleanly against a real MySQL 8 instance.
- Full flow tested via curl: register → login → browse animals → place an
  order for 2 shares → confirmed `available_shares` decremented and the
  animal flips to `sold` once shares hit 0.
- `npm run build` on the frontend compiles with no errors.

## Notes / next steps for production

- `sequelize.sync()` is used for convenience in `server.js`; swap to proper
  Sequelize migrations before deploying.
- The payment controllers are mocked — wire up real SSLCommerz/Stripe SDKs
  in `paymentController.js` when you have live credentials.
- Add image upload (e.g. Cloudinary, env vars already stubbed in `.env.example`)
  for animal listing photos — currently `image` is just a plain URL string.
