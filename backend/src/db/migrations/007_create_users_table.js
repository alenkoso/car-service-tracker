import bcrypt from 'bcrypt';

export async function up(db) {
  // Use synchronous hash for predictability
  const saltRounds = 10;
  const plainPassword = 'TestnoGeslo12345!';
  const hashedPassword = bcrypt.hashSync(plainPassword, saltRounds);

  console.log('Plain Password:', plainPassword);
  console.log('Hashed Password:', hashedPassword);
  console.log('Hash Length:', hashedPassword.length);

  await db.exec(`
    CREATE TABLE users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      name TEXT NOT NULL,
      last_login TIMESTAMP,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    -- Create index for email lookups
    CREATE INDEX idx_users_email ON users(email);

    -- Insert default user with hashed password
    INSERT INTO users (email, password, name) VALUES 
    ('alenizljubljane@gmail.com', '${hashedPassword}', 'Alen');
  `);
}

export async function down(db) {
  await db.exec(`
    DROP INDEX IF EXISTS idx_users_email;
    DROP TABLE IF EXISTS users;
  `);
}