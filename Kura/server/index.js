import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { createHash, randomBytes } from 'crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Simple file-based database
const DB_PATH = join(__dirname, 'kura-data.json');

function loadDB() {
  if (existsSync(DB_PATH)) {
    const data = readFileSync(DB_PATH, 'utf-8');
    return JSON.parse(data);
  }
  return { users: [], items: [], sessions: [], athletes: [] };
}

function saveDB(data) {
  writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}

// Initialize DB if not exists
if (!existsSync(DB_PATH)) {
  saveDB({ users: [], items: [], sessions: [], athletes: [] });
}

// Simple token generation
function generateToken() {
  return randomBytes(32).toString('hex');
}

// Hash password (simple SHA-256 for demo - use bcrypt in production)
function hashPassword(password) {
  return createHash('sha256').update(password).digest('hex');
}

// Auth middleware
function requireAuth(req, res, next) {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  
  const db = loadDB();
  const session = db.sessions.find(s => s.token === token);
  
  if (!session || new Date(session.expires_at) < new Date()) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
  
  req.user = db.users.find(u => u.id === session.user_id);
  next();
}

// Routes

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Sign up
app.post('/api/auth/sign-up', (req, res) => {
  const { name, email, password } = req.body;
  const db = loadDB();
  
  // Check if user exists
  if (db.users.find(u => u.email === email)) {
    return res.status(400).json({ error: 'Email already registered' });
  }
  
  const newUser = {
    id: Date.now(),
    name,
    email,
    password: hashPassword(password),
    created_at: new Date().toISOString()
  };
  
  db.users.push(newUser);
  
  // Create session
  const token = generateToken();
  const session = {
    token,
    user_id: newUser.id,
    created_at: new Date().toISOString(),
    expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days
  };
  db.sessions.push(session);
  saveDB(db);
  
  // Return user without password
  const { password: _, ...userWithoutPassword } = newUser;
  res.json({ user: userWithoutPassword, token });
});

// Sign in
app.post('/api/auth/sign-in', (req, res) => {
  const { email, password } = req.body;
  const db = loadDB();
  
  const user = db.users.find(u => u.email === email);
  
  if (!user || user.password !== hashPassword(password)) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }
  
  // Create session
  const token = generateToken();
  const session = {
    token,
    user_id: user.id,
    created_at: new Date().toISOString(),
    expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days
  };
  db.sessions.push(session);
  saveDB(db);
  
  // Return user without password
  const { password: _, ...userWithoutPassword } = user;
  res.json({ user: userWithoutPassword, token });
});

// Sign out
app.post('/api/auth/sign-out', requireAuth, (req, res) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  const db = loadDB();
  db.sessions = db.sessions.filter(s => s.token !== token);
  saveDB(db);
  res.json({ success: true });
});

// Get current user
app.get('/api/auth/me', requireAuth, (req, res) => {
  res.json({ user: req.user });
});

// Dashboard parent route (protected)
app.get('/api/dashboard/parent', requireAuth, (req, res) => {
  const db = loadDB();
  // Only return users that belong to the current user (or all for now)
  res.json({ users: db.users.filter(u => u.id !== req.user.id) });
});

// Create user (protected)
app.post('/api/users', requireAuth, (req, res) => {
  const { name, email } = req.body;
  const db = loadDB();
  const newUser = {
    id: Date.now(),
    name,
    email,
    created_by: req.user.id,
    created_at: new Date().toISOString()
  };
  db.users.push(newUser);
  saveDB(db);
  res.json(newUser);
});

// Get user by ID (protected)
app.get('/api/users/:id', requireAuth, (req, res) => {
  const db = loadDB();
  const user = db.users.find(u => u.id === parseInt(req.params.id));
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  res.json({ user });
});

// Delete user (protected)
app.delete('/api/users/:id', requireAuth, (req, res) => {
  const db = loadDB();
  const index = db.users.findIndex(u => u.id === parseInt(req.params.id));
  if (index === -1) {
    return res.status(404).json({ error: 'User not found' });
  }
  db.users.splice(index, 1);
  saveDB(db);
  res.json({ success: true });
});

// Coach Routes

// Get all athletes (protected)
app.get('/api/coach/athletes', requireAuth, (req, res) => {
  const db = loadDB();
  res.json({ athletes: db.athletes });
});

// Add athlete (protected)
app.post('/api/coach/athletes', requireAuth, (req, res) => {
  const { name, email, team } = req.body;
  const db = loadDB();
  const newAthlete = {
    id: Date.now(),
    name,
    email,
    team,
    status: 'active',
    coach_id: req.user.id,
    created_at: new Date().toISOString()
  };
  db.athletes.push(newAthlete);
  saveDB(db);
  res.json(newAthlete);
});

// Update athlete status (protected)
app.patch('/api/coach/athletes/:id', requireAuth, (req, res) => {
  const { status } = req.body;
  const db = loadDB();
  const athlete = db.athletes.find(a => a.id === parseInt(req.params.id));
  if (!athlete) {
    return res.status(404).json({ error: 'Athlete not found' });
  }
  athlete.status = status;
  saveDB(db);
  res.json(athlete);
});

// Delete athlete (protected)
app.delete('/api/coach/athletes/:id', requireAuth, (req, res) => {
  const db = loadDB();
  const index = db.athletes.findIndex(a => a.id === parseInt(req.params.id));
  if (index === -1) {
    return res.status(404).json({ error: 'Athlete not found' });
  }
  db.athletes.splice(index, 1);
  saveDB(db);
  res.json({ success: true });
});

// Admin Routes

// Get system stats (protected)
app.get('/api/admin/stats', requireAuth, (req, res) => {
  const db = loadDB();
  const now = new Date()
  const activeSessions = db.sessions.filter(s => new Date(s.expires_at) > now).length
  
  res.json({
    stats: {
      totalUsers: db.users.length,
      totalAthletes: db.athletes.length,
      activeSessions,
      totalSessions: db.sessions.length
    }
  })
})

// Get all users (protected)
app.get('/api/admin/users', requireAuth, (req, res) => {
  const db = loadDB()
  // Remove passwords from response
  const usersWithoutPasswords = db.users.map(({ password, ...user }) => user)
  res.json({ users: usersWithoutPasswords })
})

// Get all athletes (protected)
app.get('/api/admin/athletes', requireAuth, (req, res) => {
  const db = loadDB()
  res.json({ athletes: db.athletes })
})

// Delete user (admin, protected)
app.delete('/api/admin/users/:id', requireAuth, (req, res) => {
  const db = loadDB()
  const index = db.users.findIndex(u => u.id === parseInt(req.params.id))
  if (index === -1) {
    return res.status(404).json({ error: 'User not found' })
  }
  db.users.splice(index, 1)
  // Also remove user's sessions
  db.sessions = db.sessions.filter(s => s.user_id !== parseInt(req.params.id))
  saveDB(db)
  res.json({ success: true })
})

// Update user (admin, protected)
app.patch('/api/admin/users/:id', requireAuth, (req, res) => {
  const { status, role } = req.body
  const db = loadDB()
  const user = db.users.find(u => u.id === parseInt(req.params.id))
  if (!user) {
    return res.status(404).json({ error: 'User not found' })
  }
  if (status) user.status = status
  if (role) user.role = role
  saveDB(db)
  const { password, ...userWithoutPassword } = user
  res.json({ user: userWithoutPassword })
})

// Clear all data (admin, protected)
app.post('/api/admin/clear-data', requireAuth, (req, res) => {
  saveDB({ users: [], items: [], sessions: [], athletes: [] })
  res.json({ success: true })
})

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Kura server running on http://localhost:${PORT}`);
  console.log(`📊 Dashboard: http://localhost:${PORT}/dashboard/parent`);
  console.log(`🏃 Coach Dashboard: http://localhost:${PORT}/dashboard/coach`);
  console.log(`🔐 Admin Dashboard: http://localhost:${PORT}/dashboard/admin`);
  console.log(`🔐 Sign in: http://localhost:${PORT}/sign-in`);
});
