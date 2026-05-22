# 🏍️ Bike Information System

A complete full-stack web application for browsing, comparing, and managing bike information with user authentication, admin panel, reviews, wishlist, and analytics dashboards.

## Tech Stack

**Frontend:** React 18 + Vite, Tailwind CSS, React Router, Axios, Recharts, Framer Motion
**Backend:** Node.js + Express, JWT, Bcrypt, Multer, Nodemailer
**Database:** MySQL 8+

## Project Structure

```
bike-info-system/
├── backend/              # Express REST API
│   ├── config/           # DB & env config
│   ├── controllers/      # Route handlers
│   ├── middleware/       # JWT auth, error handling
│   ├── routes/           # API routes
│   ├── utils/            # Email, OTP helpers
│   ├── uploads/          # Bike images
│   ├── server.js
│   ├── package.json
│   └── .env.example
├── frontend/             # React + Vite SPA
│   ├── src/
│   │   ├── pages/        # Home, Login, Dashboard, Admin, ...
│   │   ├── components/   # Navbar, Sidebar, BikeCard, ...
│   │   ├── context/      # AuthContext, ThemeContext
│   │   ├── api/          # axios instance + endpoints
│   │   └── App.jsx
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
├── database/
│   └── schema.sql        # MySQL setup script
└── README.md
```

## Quick Start

### 1. Database

```bash
mysql -u root -p < database/schema.sql
```

### 2. Backend

```bash
cd backend
cp .env.example .env   # then edit with your MySQL & SMTP credentials
npm install
npm run dev            # starts on http://localhost:5000
```

### 3. Frontend

```bash
cd frontend
npm install
npm run dev            # starts on http://localhost:5173
```

The frontend reads the API URL from `VITE_API_URL` (defaults to `http://localhost:5000/api`).

## Default Admin

After running `schema.sql`, a default admin is seeded:

- **Email:** `admin@bikes.com`
- **Password:** `Admin@123`

## Features

- JWT auth (register, login, forgot password via email OTP, change password)
- Role-based access (user / admin)
- Bikes CRUD with image upload (Multer)
- Categories & brand/price/mileage filters
- Search by model or brand
- Side-by-side bike comparison
- Reviews & ratings
- Wishlist / saved bikes
- Recently viewed history
- User dashboard (stats, profile, saved, recent)
- Admin dashboard (users, bikes, recent uploads, charts)
- Dark / light mode
- Responsive layouts, glassmorphism cards, smooth animations

## API Documentation

Base URL: `http://localhost:5000/api`

### Auth
| Method | Endpoint                  | Description                      |
|--------|---------------------------|----------------------------------|
| POST   | `/auth/register`          | Register new user                |
| POST   | `/auth/login`             | Login (returns JWT)              |
| POST   | `/auth/forgot-password`   | Send OTP to email                |
| POST   | `/auth/verify-otp`        | Verify OTP                       |
| POST   | `/auth/reset-password`    | Reset password with OTP          |
| POST   | `/auth/change-password`   | Change password (auth)           |

### Bikes
| Method | Endpoint              | Description                      |
|--------|-----------------------|----------------------------------|
| GET    | `/bikes`              | List bikes (filters, search)     |
| GET    | `/bikes/:id`          | Bike details                     |
| POST   | `/bikes` (admin)      | Create bike (multipart)          |
| PUT    | `/bikes/:id` (admin)  | Update bike                      |
| DELETE | `/bikes/:id` (admin)  | Delete bike                      |
| POST   | `/bikes/compare`      | Compare bikes by ids             |

### User
| Method | Endpoint              | Description                      |
|--------|-----------------------|----------------------------------|
| GET    | `/users/me`           | Current profile                  |
| PUT    | `/users/me`           | Update profile                   |
| GET    | `/users/wishlist`     | Saved bikes                      |
| POST   | `/users/wishlist/:id` | Toggle saved bike                |
| GET    | `/users/recent`       | Recently viewed                  |
| POST   | `/users/recent/:id`   | Track recently viewed            |

### Reviews
| Method | Endpoint                 | Description                    |
|--------|--------------------------|--------------------------------|
| GET    | `/reviews/bike/:bikeId`  | Reviews for a bike             |
| POST   | `/reviews/bike/:bikeId`  | Add review (auth)              |

### Admin
| Method | Endpoint              | Description                      |
|--------|-----------------------|----------------------------------|
| GET    | `/admin/stats`        | Dashboard stats                  |
| GET    | `/admin/users`        | List users                       |
| DELETE | `/admin/users/:id`    | Delete user                      |
| GET    | `/admin/categories`   | List categories                  |
| POST   | `/admin/categories`   | Create category                  |

## Deployment

- **Frontend:** Vercel / Netlify (set `VITE_API_URL` env var)
- **Backend:** Render / Railway (set all `.env` vars)
- **Database:** Railway MySQL, PlanetScale, or any managed MySQL 8+

## License

MIT
