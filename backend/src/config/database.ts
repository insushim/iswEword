import Database, { Database as DatabaseType } from 'better-sqlite3';
import path from 'path';

const dbPath = path.join(__dirname, '../../data/vocab.db');
const db: DatabaseType = new Database(dbPath);

// Enable foreign keys
db.pragma('foreign_keys = ON');

// Initialize database tables
export function initDatabase() {
  // Users table
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      username TEXT UNIQUE NOT NULL,
      email TEXT UNIQUE,
      password_hash TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // User progress table
  db.exec(`
    CREATE TABLE IF NOT EXISTS user_progress (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id TEXT NOT NULL,
      total_words_learned INTEGER DEFAULT 0,
      current_streak INTEGER DEFAULT 0,
      longest_streak INTEGER DEFAULT 0,
      last_study_date TEXT,
      xp INTEGER DEFAULT 0,
      level INTEGER DEFAULT 1,
      daily_goal INTEGER DEFAULT 20,
      today_words_studied INTEGER DEFAULT 0,
      unlocked_levels TEXT DEFAULT '[1]',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  // Leitner box data
  db.exec(`
    CREATE TABLE IF NOT EXISTS leitner_data (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id TEXT NOT NULL,
      word_id INTEGER NOT NULL,
      box INTEGER DEFAULT 1 CHECK (box >= 1 AND box <= 5),
      last_review TEXT,
      next_review TEXT,
      correct_count INTEGER DEFAULT 0,
      wrong_count INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      UNIQUE(user_id, word_id)
    )
  `);

  // Achievements table
  db.exec(`
    CREATE TABLE IF NOT EXISTS user_achievements (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id TEXT NOT NULL,
      achievement_id TEXT NOT NULL,
      unlocked_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      UNIQUE(user_id, achievement_id)
    )
  `);

  // Study sessions table
  db.exec(`
    CREATE TABLE IF NOT EXISTS study_sessions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id TEXT NOT NULL,
      date TEXT NOT NULL,
      words_studied INTEGER DEFAULT 0,
      correct_count INTEGER DEFAULT 0,
      wrong_count INTEGER DEFAULT 0,
      duration INTEGER DEFAULT 0,
      mode TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  console.log('Database initialized successfully');
}

export default db;
