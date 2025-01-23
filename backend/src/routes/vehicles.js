import express from 'express';
import { getDb } from '../db/init.js';

const router = express.Router();

// Get all vehicles for the authenticated user
router.get('/', async (req, res) => {
  try {
    const db = await getDb();
    const vehicles = await db.all(
      'SELECT * FROM vehicles WHERE user_id = ?',
      req.userId // This comes from the auth middleware
    );
    res.json(vehicles);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create new vehicle
router.post('/', async (req, res) => {
  try {
    const db = await getDb();
    const {
      name,
      make,
      model,
      year,
      vin,
      engine,
      engine_type,
      first_registration,
      notes
    } = req.body;

    const result = await db.run(`
      INSERT INTO vehicles (
        user_id, name, make, model, year, 
        vin, engine, engine_type, first_registration, notes
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      req.userId, // Use authenticated user's ID
      name,
      make,
      model, 
      year,
      vin,
      engine,
      engine_type,
      first_registration,
      notes
    ]);

    const vehicle = await db.get(
      'SELECT * FROM vehicles WHERE id = ? AND user_id = ?',
      [result.lastID, req.userId]
    );
    res.status(201).json(vehicle);
  } catch (error) {
    console.error('Error creating vehicle:', error);
    res.status(500).json({ error: 'Failed to create vehicle' });
  }
});

// Update vehicle by ID
router.put('/:id', async (req, res) => {
  try {
    const { 
      name, 
      make, 
      model, 
      year, 
      vin, 
      first_registration, 
      engine, 
      engine_type, 
      notes 
    } = req.body;
    
    const db = await getDb();

    // First verify the vehicle belongs to the user
    const existingVehicle = await db.get(
      'SELECT id FROM vehicles WHERE id = ? AND user_id = ?',
      [req.params.id, req.userId]
    );

    if (!existingVehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }

    const result = await db.run(
      `UPDATE vehicles 
       SET name = ?, 
           make = ?, 
           model = ?, 
           year = ?, 
           vin = ?, 
           first_registration = ?, 
           engine = ?, 
           engine_type = ?, 
           notes = ? 
       WHERE id = ? AND user_id = ?`,
      [
        name, 
        make, 
        model, 
        year, 
        vin, 
        first_registration, 
        engine, 
        engine_type, 
        notes, 
        req.params.id,
        req.userId // Ensure we only update user's own vehicle
      ]
    );

    if (result.changes === 0) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }

    const updatedVehicle = await db.get(
      'SELECT * FROM vehicles WHERE id = ? AND user_id = ?', 
      [req.params.id, req.userId]
    );
    res.json(updatedVehicle);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete vehicle (optional - add if needed)
router.delete('/:id', async (req, res) => {
  try {
    const db = await getDb();
    
    // First verify the vehicle belongs to the user
    const existingVehicle = await db.get(
      'SELECT id FROM vehicles WHERE id = ? AND user_id = ?',
      [req.params.id, req.userId]
    );

    if (!existingVehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }

    await db.run(
      'DELETE FROM vehicles WHERE id = ? AND user_id = ?',
      [req.params.id, req.userId]
    );

    res.json({ message: 'Vehicle deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;