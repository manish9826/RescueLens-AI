import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.resolve(__dirname, 'database.sqlite');

let dbPromise = null;

export async function getDb() {
  if (!dbPromise) {
    dbPromise = open({
      filename: dbPath,
      driver: sqlite3.Database
    }).then(async (db) => {
      await initDb(db);
      return db;
    });
  }
  return dbPromise;
}

async function initDb(db) {
  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      full_name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS incidents (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      incidentType TEXT,
      emergencyCategory TEXT,
      severity TEXT,
      priorityScore INTEGER,
      confidence INTEGER,
      summary TEXT,
      dangerLevel TEXT,
      immediateActions TEXT,
      doNotDo TEXT,
      rescueResources TEXT,
      image TEXT,
      location TEXT,
      timestamp TEXT,
      status TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
    );
  `);
  console.log('Database initialized successfully.');
}
