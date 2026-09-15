import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { getDb } from '../db.js';

const router = express.Router();

export const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_for_dev_only';
if (!process.env.JWT_SECRET && process.env.NODE_ENV === 'production') {
  console.error('CRITICAL: JWT_SECRET must be defined in production environment variables.');
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required.' });
    }

    const trimmedName = name.trim();
    const cleanEmail = email.trim().toLowerCase();

    if (trimmedName.length < 2 || trimmedName.length > 80) {
      return res.status(400).json({ error: 'Name must be between 2 and 80 characters.' });
    }

    if (!EMAIL_REGEX.test(cleanEmail) || cleanEmail.length > 120) {
      return res.status(400).json({ error: 'Please provide a valid email address.' });
    }

    if (password.length < 8 || password.length > 128) {
      return res.status(400).json({ error: 'Password must contain between 8 and 128 characters.' });
    }

    const db = await getDb();
    
    const existingUser = await db.get('SELECT * FROM users WHERE email = ?', [cleanEmail]);
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists with this email address.' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const id = Date.now().toString();

    await db.run(
      'INSERT INTO users (id, full_name, email, password_hash) VALUES (?, ?, ?, ?)',
      [id, name, email, hashedPassword]
    );

    const token = jwt.sign({ id }, JWT_SECRET, { expiresIn: '1h' });

    res.status(201).json({
      success: true,
      token,
      user: { id, name, email }
    });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ error: 'An internal server error occurred.' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    const db = await getDb();
    const user = await db.get('SELECT * FROM users WHERE email = ?', [email]);
    
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '1h' });

    res.json({
      success: true,
      token,
      user: { id: user.id, name: user.full_name, email: user.email }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'An internal server error occurred.' });
  }
});

// Authentication Middleware
export const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ error: 'No token, authorization denied.' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // { id, iat, exp }
    next();
  } catch (err) {
    res.status(401).json({ error: 'Token is not valid or session has expired.' });
  }
};

// Optional Authentication Middleware (populates req.user if token valid, but allows guest)
export const optionalAuthMiddleware = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) {
    return next();
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
  } catch (err) {
    // proceed without req.user
  }
  next();
};

// Get current user (me)
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const db = await getDb();
    const user = await db.get('SELECT id, full_name, email FROM users WHERE id = ?', [req.user.id]);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }
    
    res.json({ success: true, user: { id: user.id, name: user.full_name, email: user.email } });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get user profile with stats
router.get('/profile', authMiddleware, async (req, res) => {
  try {
    const db = await getDb();
    const user = await db.get('SELECT id, full_name, email, created_at FROM users WHERE id = ?', [req.user.id]);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    const incidentsStats = await db.get(`
      SELECT 
        COUNT(*) as totalIncidents,
        SUM(CASE WHEN severity = 'CRITICAL' THEN 1 ELSE 0 END) as criticalIncidents,
        SUM(CASE WHEN status = 'RESOLVED' THEN 1 ELSE 0 END) as resolvedIncidents,
        MAX(created_at) as lastActivity
      FROM incidents
      WHERE user_id = ?
    `, [req.user.id]);
    
    res.json({
      success: true,
      profile: {
        id: user.id,
        name: user.full_name,
        email: user.email,
        createdAt: user.created_at,
        totalIncidents: incidentsStats.totalIncidents || 0,
        criticalIncidents: incidentsStats.criticalIncidents || 0,
        resolvedIncidents: incidentsStats.resolvedIncidents || 0,
        lastActivity: incidentsStats.lastActivity || null
      }
    });
  } catch (err) {
    console.error('Profile fetch error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update user profile
router.put('/profile', authMiddleware, async (req, res) => {
  try {
    const { name } = req.body;
    if (!name || name.trim().length < 2 || name.trim().length > 80) {
      return res.status(400).json({ error: 'Name must be between 2 and 80 characters.' });
    }
    const db = await getDb();
    await db.run('UPDATE users SET full_name = ? WHERE id = ?', [name.trim(), req.user.id]);
    res.json({ success: true, message: 'Profile updated successfully.' });
  } catch (err) {
    console.error('Profile update error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Logout (client side discards token usually, but here is a simple stub)
router.post('/logout', (req, res) => {
  res.json({ success: true, message: 'Logged out successfully.' });
});

export default router;
