export async function up(db) {
    await db.exec(`
      -- Add user_id foreign key constraint to vehicles table
      CREATE TABLE vehicles_new (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        name TEXT NOT NULL,
        make TEXT NOT NULL,
        model TEXT NOT NULL,
        year INTEGER,
        vin TEXT,
        engine TEXT,
        engine_type TEXT,
        first_registration DATE,
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id)
      );
  
      -- Copy existing data
      INSERT INTO vehicles_new 
      SELECT * FROM vehicles;
  
      -- Drop old table and rename new one
      DROP TABLE vehicles;
      ALTER TABLE vehicles_new RENAME TO vehicles;
  
      -- Create indices for better query performance
      CREATE INDEX idx_vehicles_user_id ON vehicles(user_id);
    `);
  }
  
  export async function down(db) {
    await db.exec(`
      CREATE TABLE vehicles_new (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        name TEXT NOT NULL,
        make TEXT NOT NULL,
        model TEXT NOT NULL,
        year INTEGER,
        vin TEXT,
        engine TEXT,
        engine_type TEXT,
        first_registration DATE,
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
  
      INSERT INTO vehicles_new 
      SELECT * FROM vehicles;
  
      DROP TABLE vehicles;
      ALTER TABLE vehicles_new RENAME TO vehicles;
  
      DROP INDEX IF EXISTS idx_vehicles_user_id;
    `);
  }