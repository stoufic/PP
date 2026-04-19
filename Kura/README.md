# Kura

Full-stack web application with authentication and dashboard functionality.

## Stack

- **Frontend**: React + Vite + TailwindCSS
- **Backend**: Node.js + Express
- **Database**: JSON file-based (no setup required)

## Quick Start

### Install Dependencies

```bash
# Backend
cd server
npm install

# Frontend
cd ../client
npm install
```

### Run the App

```bash
# Terminal 1 - Backend (port 3001)
cd server
npm run dev

# Terminal 2 - Frontend (port 3000)
cd client
npm run dev
```

Or use the quick start script (Windows):
```bash
start.bat
```

## Routes

### Frontend
- `/` or `/dashboard/parent` - Parent Dashboard (protected)
- `/dashboard/coach` - Coach Dashboard (protected)
- `/sign-in` - Sign in page
- `/sign-up` - Sign up page

### API
- `GET /api/health` - Health check
- `POST /api/auth/sign-up` - Create account
- `POST /api/auth/sign-in` - Sign in
- `POST /api/auth/sign-out` - Sign out
- `GET /api/auth/me` - Get current user
- `GET /api/dashboard/parent` - Get all users (protected)
- `POST /api/users` - Create user (protected)
- `GET /api/users/:id` - Get user by ID (protected)
- `DELETE /api/users/:id` - Delete user (protected)
- `GET /api/coach/athletes` - Get all athletes (protected)
- `POST /api/coach/athletes` - Add athlete (protected)
- `PATCH /api/coach/athletes/:id` - Update athlete status (protected)
- `DELETE /api/coach/athletes/:id` - Remove athlete (protected)

## Features

✅ User authentication (sign up/sign in)
✅ Protected routes with JWT-like tokens
✅ Session management (7-day expiry)
✅ Parent dashboard with user management
✅ Coach dashboard with athlete tracking
✅ Stats cards (total, active, new this week)
✅ Athlete status management (active/inactive/pending)
✅ Responsive UI with TailwindCSS

## Project Structure

```
kura/
├── client/          # React frontend
│   └── src/
│       ├── pages/
│       │   ├── DashboardParent.jsx
│       │   ├── DashboardCoach.jsx
│       │   ├── SignIn.jsx
│       │   └── SignUp.jsx
│       ├── App.jsx
│       └── main.jsx
├── server/          # Express backend
│   ├── index.js
│   └── package.json
├── start.bat        # Quick start script
└── README.md
```

## Security Notes

⚠️ This is a demo application. For production:
- Use bcrypt for password hashing (currently SHA-256)
- Use HTTPS
- Implement rate limiting
- Add input validation
- Use a real database (PostgreSQL, MongoDB, etc.)
