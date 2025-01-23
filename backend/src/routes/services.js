import express from 'express';
import { getDb } from '../db/init.js';

const router = express.Router();

// Get all service records for a vehicle
router.get('/vehicle/:vehicleId', async (req, res) => {
  try {
    const db = await getDb();
    
    // First verify the vehicle belongs to the user
    const vehicle = await db.get(
      'SELECT id FROM vehicles WHERE id = ? AND user_id = ?',
      [req.params.vehicleId, req.userId]
    );

    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }

    const services = await db.all(
      `SELECT s.* 
       FROM service_records s
       JOIN vehicles v ON s.vehicle_id = v.id
       WHERE s.vehicle_id = ? AND v.user_id = ?
       ORDER BY service_date DESC`,
      [req.params.vehicleId, req.userId]
    );
    res.json(services);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create new service record
router.post('/', async (req, res) => {
  try {
    const {
      vehicle_id,
      service_date,
      mileage,
      service_type,
      description,
      cost,
      location,
      next_service_mileage,
      next_service_notes
    } = req.body;

    // First verify the vehicle belongs to the user
    const db = await getDb();
    const vehicle = await db.get(
      'SELECT id FROM vehicles WHERE id = ? AND user_id = ?',
      [vehicle_id, req.userId]
    );

    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }

    // Convert empty strings to null for number fields
    const sanitizedMileage = mileage === '' ? null : mileage;
    const sanitizedCost = cost === '' ? null : cost;
    const sanitizedNextServiceMileage = next_service_mileage === '' ? null : next_service_mileage;

    const result = await db.run(
      `INSERT INTO service_records (
        vehicle_id, service_date, mileage, service_type, description,
        cost, location, next_service_mileage, next_service_notes
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        vehicle_id,
        service_date,
        sanitizedMileage,
        service_type,
        description,
        sanitizedCost,
        location,
        sanitizedNextServiceMileage,
        next_service_notes
      ]
    );
    
    const newService = await db.get(
      `SELECT s.* 
       FROM service_records s
       JOIN vehicles v ON s.vehicle_id = v.id
       WHERE s.id = ? AND v.user_id = ?`, 
      [result.lastID, req.userId]
    );
    res.status(201).json(newService);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update existing service record
router.put('/:id', async (req, res) => {
  try {
    const {
      service_date,
      mileage,
      service_type,
      description,
      cost,
      location,
      next_service_mileage,
      next_service_notes
    } = req.body;

    const db = await getDb();

    // Verify the service record belongs to a vehicle owned by the user
    const serviceExists = await db.get(
      `SELECT s.id 
       FROM service_records s
       JOIN vehicles v ON s.vehicle_id = v.id
       WHERE s.id = ? AND v.user_id = ?`,
      [req.params.id, req.userId]
    );

    if (!serviceExists) {
      return res.status(404).json({ message: 'Service record not found' });
    }

    // Convert empty strings to null for number fields
    const sanitizedMileage = mileage === '' ? null : mileage;
    const sanitizedCost = cost === '' ? null : cost;
    const sanitizedNextServiceMileage = next_service_mileage === '' ? null : next_service_mileage;

    const result = await db.run(
      `UPDATE service_records 
       SET service_date = ?, 
           mileage = ?, 
           service_type = ?, 
           description = ?, 
           cost = ?, 
           location = ?, 
           next_service_mileage = ?, 
           next_service_notes = ? 
       WHERE id = ?`,
      [
        service_date,
        sanitizedMileage,
        service_type,
        description,
        sanitizedCost,
        location,
        sanitizedNextServiceMileage,
        next_service_notes,
        req.params.id
      ]
    );

    if (result.changes === 0) {
      return res.status(404).json({ message: 'Service record not found' });
    }

    const updatedService = await db.get(
      `SELECT s.* 
       FROM service_records s
       JOIN vehicles v ON s.vehicle_id = v.id
       WHERE s.id = ? AND v.user_id = ?`,
      [req.params.id, req.userId]
    );
    res.json(updatedService);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get services within a date range
router.get('/range', async (req, res) => {
  try {
    const { start_date, end_date, vehicle_id } = req.query;
    const db = await getDb();
    
    let query = `
      SELECT s.* 
      FROM service_records s
      JOIN vehicles v ON s.vehicle_id = v.id
      WHERE v.user_id = ?
      AND service_date BETWEEN ? AND ?
    `;
    let params = [req.userId, start_date, end_date];

    // Add vehicle filter if vehicle_id is provided
    if (vehicle_id) {
      query += ' AND s.vehicle_id = ?';
      params.push(vehicle_id);

      // Verify the vehicle belongs to the user
      const vehicle = await db.get(
        'SELECT id FROM vehicles WHERE id = ? AND user_id = ?',
        [vehicle_id, req.userId]
      );

      if (!vehicle) {
        return res.status(404).json({ message: 'Vehicle not found' });
      }
    }

    query += ' ORDER BY service_date DESC';

    const services = await db.all(query, params);
    res.json(services);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;