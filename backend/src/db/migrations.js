import { getDb } from './init.js';

async function addNewColumnsToVehicles() {
  const db = await getDb();
  
  try {
    // Add new columns one by one
    await db.exec(`
      BEGIN TRANSACTION;
      
      -- Add first_registration column if it doesn't exist
      ALTER TABLE vehicles ADD COLUMN first_registration DATE;
      
      -- Add engine column if it doesn't exist
      ALTER TABLE vehicles ADD COLUMN engine TEXT;
      
      -- Add engine_type column if it doesn't exist
      ALTER TABLE vehicles ADD COLUMN engine_type TEXT;
      
      COMMIT;
    `);
    
    console.log('Successfully added new columns to vehicles table');
    
    // Update the existing vehicle with new information
    await db.run(`
      UPDATE vehicles 
      SET first_registration = ?,
          engine = ?,
          engine_type = ?,
          model = ?
      WHERE id = 1`,
      ['2018-04-26', '2.0 TDI', 'DCYA', 'Octavia III Style 4x4 DSG']
    );
    
    console.log('Successfully updated vehicle information');
    
  } catch (error) {
    console.error('Migration failed:', error);
    await db.exec('ROLLBACK');
    throw error;
  }
}

// Execute migrations
addNewColumnsToVehicles()
  .then(() => {
    console.log('Migrations completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Migration failed:', error);
    process.exit(1);
  });