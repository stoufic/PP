# 🚛 TruckBase - Food Truck Management Platform

**A complete SaaS solution for food truck operators to manage locations, permits, inventory, events, and social media.**

---

## 🎯 The Problem

Food truck operators juggle multiple challenges daily:
- Tracking profitable locations and avoiding scheduling conflicts
- Managing permit renewals (fines up to $2K for expired permits!)
- Inventory management in limited mobile kitchen space
- Coordinating festivals, catering, and regular spots
- Keeping customers updated on location via social media

**Existing solutions** are built for brick-and-mortar restaurants. Food trucks need **mobile-first workflow management**.

---

## ✨ Features

### 📍 Location Manager
- Track all your spots with addresses and GPS coordinates
- Record visit frequency and average revenue per location
- Identify your most profitable locations

### 📋 Permit Compliance Tracker
- Store all permits (health, business, fire, parking, vendor)
- Automatic expiry alerts 30 days before renewal
- Avoid costly fines with proactive notifications

### 📦 Space-Aware Inventory
- Track stock levels with min/max thresholds
- Low-stock alerts for critical items
- Record storage locations within your truck
- Monitor space requirements (cubic feet)

### 🎉 Event Calendar
- Manage festivals, catering gigs, private events
- Track event fees and details
- Avoid double-booking conflicts

### 📱 Social Media Auto-Generator
- Pre-built templates for Instagram, Facebook, Twitter, TikTok
- Generate location updates, event announcements, daily posts
- Save drafts and track posting history

### 📊 Dashboard & Analytics
- Today's schedule at a glance
- Revenue tracking (weekly, daily average)
- Alerts for expiring permits and low stock
- Upcoming events overview

---

## 🏗️ Tech Stack

**Backend:**
- Node.js + Express
- PostgreSQL with Prisma ORM
- JWT Authentication
- Winston Logger
- Express Validator + Rate Limiting + Helmet (security)

**Frontend:**
- React 18
- Tailwind CSS
- React Router
- Axios

**DevOps:**
- Docker ready
- Environment-based configuration

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL (or use SQLite for local dev)
- npm or yarn

### 1. Clone & Install

```bash
cd truckbase

# Backend
cd backend
npm install

# Frontend (in another terminal)
cd ../frontend
npm install
```

### 2. Configure Environment

**Backend** (`backend/.env`):
```env
PORT=3001
NODE_ENV=development

# PostgreSQL
DATABASE_URL="postgresql://postgres:password@localhost:5432/truckbase?schema=public"

# OR SQLite for local dev:
# DATABASE_URL="file:./dev.db"

JWT_SECRET=your-super-secret-jwt-key-change-in-production
FRONTEND_URL=http://localhost:3000
```

**Frontend** (`frontend/.env`):
```env
REACT_APP_API_URL=http://localhost:3001/api
```

### 3. Setup Database

```bash
cd backend
npx prisma migrate dev --name init
npx prisma generate
```

### 4. Run the App

**Backend:**
```bash
cd backend
npm run dev
```

**Frontend** (new terminal):
```bash
cd frontend
npm start
```

Visit `http://localhost:3000` 🎉

---

## 💰 Monetization Strategy

### Target Market
- **35,000+ food trucks** in the US alone
- Growing 8% annually
- Most using spreadsheets or generic restaurant software

### Pricing Tiers

**Starter - $49/month**
- Single truck
- All core features
- Email support

**Pro - $99/month**
- Up to 3 trucks
- Advanced analytics
- Priority support
- Custom integrations

**Enterprise - $299/month**
- Unlimited trucks
- White-label options
- Dedicated support
- API access

### Revenue Projections
| Customers | MRR | ARR |
|-----------|-----|-----|
| 50 | $3,500 | $42K |
| 200 | $14,000 | $168K |
| 500 | $35,000 | $420K |

### Go-to-Market Channels
1. **Food truck associations** - Sponsor events, partner with orgs
2. **Instagram/Facebook ads** - Target food truck owners
3. **Trade shows** - Mobile food vending conferences
4. **Referral program** - $50 credit for each referral
5. **Content marketing** - Blog about food truck operations, permits, best locations

---

## 📁 Project Structure

```
truckbase/
├── backend/
│   ├── src/
│   │   ├── routes/       # API endpoints
│   │   ├── middleware/   # Auth, validation
│   │   ├── utils/        # Logger, helpers
│   │   └── server.js     # Entry point
│   ├── prisma/
│   │   └── schema.prisma # Database models
│   ├── logs/             # Application logs
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/   # Reusable UI
│   │   ├── pages/        # Route components
│   │   ├── context/      # React context (auth)
│   │   └── App.js
│   ├── public/
│   └── package.json
├── Dockerfile
├── docker-compose.yml
└── README.md
```

---

## 🔐 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Rate limiting (100 req/15min)
- Helmet.js security headers
- CORS protection
- Input validation with express-validator
- SQL injection prevention (Prisma ORM)

---

## 🐳 Docker Deployment

```bash
docker-compose up -d
```

This starts:
- PostgreSQL database
- Backend API
- Frontend (production build)

---

## 🧪 Testing

```bash
cd backend
npm test
```

---

## 📝 API Endpoints

### Authentication
- `POST /api/auth/register` - Create account
- `POST /api/auth/login` - Sign in
- `GET /api/auth/me` - Get current user

### Trucks
- `GET /api/trucks/my` - Get user's truck
- `POST /api/trucks` - Create truck
- `PUT /api/trucks/:id` - Update truck

### Locations
- `GET /api/locations` - List all locations
- `POST /api/locations` - Add location
- `PUT /api/locations/:id` - Update location
- `DELETE /api/locations/:id` - Delete location

### Permits
- `GET /api/permits` - List permits (with expiry alerts)
- `POST /api/permits` - Add permit
- `PATCH /api/permits/:id/status` - Update status

### Inventory
- `GET /api/inventory` - List items (with low-stock alerts)
- `POST /api/inventory` - Add item
- `PATCH /api/inventory/:id/quantity` - Update quantity
- `DELETE /api/inventory/:id` - Delete item

### Events
- `GET /api/events` - List events
- `POST /api/events` - Create event
- `PUT /api/events/:id` - Update event
- `DELETE /api/events/:id` - Delete event

### Schedules
- `GET /api/schedules` - Get schedule (date range queryable)
- `POST /api/schedules` - Add schedule entry
- `DELETE /api/schedules/:id` - Delete entry

### Social Media
- `GET /api/social/posts` - List posts
- `POST /api/social/generate` - Generate post from template
- `POST /api/social/posts` - Save draft
- `PATCH /api/social/posts/:id/posted` - Mark as posted

### Reports
- `GET /api/reports/dashboard` - Dashboard stats
- `POST /api/reports/daily` - Log daily revenue

---

## 🤝 Contributing

Contributions welcome! Please:
1. Fork the repo
2. Create a feature branch
3. Submit a PR

---

## 📄 License

MIT License - see LICENSE file

---

## 🙌 Next Steps

1. **Customize branding** - Update colors, logo, name
2. **Add payment integration** - Stripe for subscriptions
3. **Email notifications** - SMTP for permit alerts
4. **Mobile app** - React Native version
5. **POS integrations** - Square, Toast, Clover APIs
6. **Multi-language support** - i18n for diverse operators

---

**Built with ❤️ for food truck entrepreneurs everywhere.**

Questions? Reach out at support@truckbase.io (placeholder)
