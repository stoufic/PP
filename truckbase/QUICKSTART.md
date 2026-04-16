# 🚀 TruckBase - 5-Minute Quick Start

## Option 1: Local Development (Fastest)

### Step 1: Install Dependencies (2 min)

```bash
cd truckbase

# Backend
cd backend
npm install

# Frontend (new terminal)
cd ../frontend  
npm install
```

### Step 2: Setup Environment (1 min)

**Backend** - Create `backend/.env`:
```env
DATABASE_URL="file:./dev.db"
JWT_SECRET=dev-secret-change-in-production
PORT=3001
FRONTEND_URL=http://localhost:3000
```

**Frontend** - Create `frontend/.env`:
```env
REACT_APP_API_URL=http://localhost:3001/api
```

### Step 3: Initialize Database (30 sec)

```bash
cd backend
npx prisma migrate dev --name init
npx prisma generate
```

### Step 4: Run! (1 min)

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm start
```

Visit **http://localhost:3000** ✅

---

## Option 2: Docker (One Command)

```bash
cd truckbase
docker-compose up -d
```

Wait 30 seconds for database to initialize, then visit **http://localhost:3000**

---

## First Steps After Login

1. **Create your truck profile** (cuisine type, name)
2. **Add 2-3 locations** you frequent
3. **Add permits** with expiry dates (get alerts!)
4. **Log some inventory items** 
5. **Check out the dashboard** - see it all together

---

## Troubleshooting

**"Cannot connect to database"**
- Make sure PostgreSQL is running OR use SQLite (`file:./dev.db`)

**"Port already in use"**
- Change PORT in `backend/.env` to `3002` or another available port

**"Module not found"**
- Run `npm install` in both backend and frontend folders

**Frontend blank page**
- Check browser console for errors
- Verify backend is running on port 3001

---

## Next Steps

- Read full README.md for features and API docs
- Customize branding in frontend components
- Set up email notifications (SMTP in .env)
- Deploy with Docker Compose or to Vercel/Railway

Need help? Check README.md for full documentation!
