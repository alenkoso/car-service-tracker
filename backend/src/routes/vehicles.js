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

// Update vehicle by ID - Single route to avoid conflict
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
       WHERE id = ?`,
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
        req.params.id
      ]
    );

    if (result.changes === 0) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }

    const updatedVehicle = await db.get('SELECT * FROM vehicles WHERE id = ?', req.params.id);
    res.json(updatedVehicle);
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

    // TODO: Add user_id from authenticated session
    const user_id = 1; // Temporary default user_id

    const result = await db.run(`
      INSERT INTO vehicles (
        user_id, name, make, model, year, 
        vin, engine, engine_type, first_registration, notes
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      user_id, name, make, model, year,
      vin, engine, engine_type, first_registration, notes
    ]);

    const vehicle = await db.get('SELECT * FROM vehicles WHERE id = ?', result.lastID);
    res.status(201).json(vehicle);
  } catch (error) {
    console.error('Error creating vehicle:', error);
    res.status(500).json({ error: 'Failed to create vehicle' });
  }
});

export default router;