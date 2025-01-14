import express from 'express';
import { getDb } from '../db/init.js';

const router = express.Router();

// Get all service records for a vehicle
router.get('/vehicle/:vehicleId', async (req, res) => {
  try {
    const db = await getDb();
    const services = await db.all(
      'SELECT * FROM service_records WHERE vehicle_id = ? ORDER BY service_date DESC',
      req.params.vehicleId
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
      summary,
      description,
      cost,
      location,
      next_service_mileage,
      next_service_notes
    } = req.body;

    const db = await getDb();
    const result = await db.run(
      `INSERT INTO service_records (
        vehicle_id, service_date, mileage, summary, description,
        cost, location, next_service_mileage, next_service_notes
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [vehicle_id, service_date, mileage, summary, description,
       cost, location, next_service_mileage, next_service_notes]
    );
    res.status(201).json({ id: result.lastID });
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
        SELECT * FROM service_records 
        WHERE service_date BETWEEN ? AND ?
      `;
      let params = [start_date, end_date];
  
      // Add vehicle filter if vehicle_id is provided
      if (vehicle_id) {
        query += ' AND vehicle_id = ?';
        params.push(vehicle_id);
      }
  
      query += ' ORDER BY service_date DESC';
  
      const services = await db.all(query, params);
      res.json(services);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  
// Get services by type (using summary field for now)
router.get('/type/:type', async (req, res) => {
  try {
    const { type } = req.params;
    const { vehicle_id } = req.query;
    const db = await getDb();
    
    let query = `
      SELECT * FROM service_records 
      WHERE (
        LOWER(summary) LIKE LOWER(?)
        OR LOWER(description) LIKE LOWER(?)
      )
    `;
    let params = [`%${type}%`, `%${type}%`];

    if (vehicle_id) {
      query += ' AND vehicle_id = ?';
      params.push(vehicle_id);
    }

    query += ' ORDER BY service_date DESC';

    const services = await db.all(query, params);
    res.json(services);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;