import express from 'express';
import { getDb } from '../db/init.js';

const router = express.Router();

// Get all vehicles
router.get('/', async (req, res) => {
  try {
    const db = await getDb();
    const vehicles = await db.all('SELECT * FROM vehicles');
    res.json(vehicles);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get vehicle by ID
router.get('/:id', async (req, res) => {
  try {
    const db = await getDb();
    const vehicle = await db.get('SELECT * FROM vehicles WHERE id = ?', req.params.id);
    if (!vehicle) {
      return res.status(404).json({ error: 'Vehicle not found' });
    }
    res.json(vehicle);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create new vehicle
router.post('/', async (req, res) => {
    try {
      const { name, make, model, year, vin, notes } = req.body;  // Added notes
      const db = await getDb();
      const result = await db.run(
        'INSERT INTO vehicles (user_id, name, make, model, year, vin, notes) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [1, name, make, model, year, vin, notes]  // Added notes
      );
      res.status(201).json({ id: result.lastID });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  
// Update vehicle by ID
  router.put('/:id', async (req, res) => {
    try {
      const { name, make, model, year, vin, notes } = req.body;
      const db = await getDb();
      await db.run(
        'UPDATE vehicles SET name = ?, make = ?, model = ?, year = ?, vin = ?, notes = ? WHERE id = ?',
        [name, make, model, year, vin, notes, req.params.id]
      );
      res.json({ message: 'Vehicle updated successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

export default router;