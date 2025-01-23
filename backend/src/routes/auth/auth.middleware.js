// src/routes/auth/auth.routes.js
import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { getDb } from '../../db/init.js';
export const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'; // In production, use environment variable

export const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      throw new Error();
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Please authenticate' });
  }
};

const router = express.Router();

const USERS = [
  {
    id: 1,
    email: 'admin@example.com',
    // Password: admin123
    password: '$2b$10$pmZ5q9.g/4dA.3Zm9k8zP.r.QJJOL1GnE8GXE/VVq7wNAmTF8P0B.',
    name: 'Admin User'
  }
  // Add more pre-registered users here
];

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = USERS.find(u => u.email === email);
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '24h' });
    
    res.json({
      token,
      userId: user.id,
      name: user.name
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;