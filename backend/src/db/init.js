import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

let db = null;

export async function getDb() {
  if (db) {
    return db;
  }

  db = await open({
    filename: path.join(__dirname, '../../data/database.sqlite'),
    driver: sqlite3.Database
  });

  return db;
}

export async function initializeDatabase() {
  const db = await getDb();

  await db.exec(`
    CREATE TABLE IF NOT EXISTS vehicles (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      name TEXT NOT NULL,
      make TEXT NOT NULL,
      model TEXT NOT NULL,
      year INTEGER,
      vin TEXT,
      notes TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS service_types (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      description TEXT,
      is_custom BOOLEAN DEFAULT FALSE
    );

    CREATE TABLE IF NOT EXISTS service_records (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      vehicle_id INTEGER NOT NULL,
      service_date DATE NOT NULL,
      mileage INTEGER NOT NULL CHECK (mileage > 0 AND mileage <= 1000000),
      service_type_id INTEGER,
      summary TEXT NOT NULL,
      description TEXT,
      cost DECIMAL(10,2) CHECK (cost >= 0),
      location TEXT,
      next_service_mileage INTEGER CHECK (next_service_mileage > 0),
      next_service_notes TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (vehicle_id) REFERENCES vehicles(id),
      FOREIGN KEY (service_type_id) REFERENCES service_types(id)
    );
  `);

  console.log('Database initialized');
}