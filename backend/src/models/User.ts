import { getDb, save } from '../config/database';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

export interface User {
  id: string;
  username: string;
  email: string | null;
  password_hash: string;
  created_at: string;
  updated_at: string;
}

export interface UserProgress {
  id: number;
  user_id: string;
  total_words_learned: number;
  current_streak: number;
  longest_streak: number;
  last_study_date: string | null;
  xp: number;
  level: number;
  daily_goal: number;
  today_words_studied: number;
  unlocked_levels: string;
}

export interface LeitnerData {
  id: number;
  user_id: string;
  word_id: number;
  box: number;
  last_review: string | null;
  next_review: string | null;
  correct_count: number;
  wrong_count: number;
}

// Helper function to convert sql.js result to object
function rowToObject<T>(columns: string[], values: unknown[]): T {
  const obj: Record<string, unknown> = {};
  columns.forEach((col, i) => {
    obj[col] = values[i];
  });
  return obj as T;
}

class UserModel {
  create(username: string, password: string, email?: string): User {
    const db = getDb();
    const id = uuidv4();
    const password_hash = bcrypt.hashSync(password, 10);

    db.run(
      `INSERT INTO users (id, username, email, password_hash) VALUES (?, ?, ?, ?)`,
      [id, username, email || null, password_hash]
    );

    // Create initial progress
    db.run(`INSERT INTO user_progress (user_id) VALUES (?)`, [id]);

    save();
    return this.findById(id)!;
  }

  findById(id: string): User | undefined {
    const db = getDb();
    const result = db.exec('SELECT * FROM users WHERE id = ?', [id]);
    if (result.length === 0 || result[0].values.length === 0) return undefined;
    return rowToObject<User>(result[0].columns, result[0].values[0]);
  }

  findByUsername(username: string): User | undefined {
    const db = getDb();
    const result = db.exec('SELECT * FROM users WHERE username = ?', [username]);
    if (result.length === 0 || result[0].values.length === 0) return undefined;
    return rowToObject<User>(result[0].columns, result[0].values[0]);
  }

  findByEmail(email: string): User | undefined {
    const db = getDb();
    const result = db.exec('SELECT * FROM users WHERE email = ?', [email]);
    if (result.length === 0 || result[0].values.length === 0) return undefined;
    return rowToObject<User>(result[0].columns, result[0].values[0]);
  }

  verifyPassword(user: User, password: string): boolean {
    return bcrypt.compareSync(password, user.password_hash);
  }

  getProgress(userId: string): UserProgress | undefined {
    const db = getDb();
    const result = db.exec('SELECT * FROM user_progress WHERE user_id = ?', [userId]);
    if (result.length === 0 || result[0].values.length === 0) return undefined;
    return rowToObject<UserProgress>(result[0].columns, result[0].values[0]);
  }

  updateProgress(userId: string, updates: Partial<UserProgress>): void {
    const db = getDb();
    const allowedFields = [
      'total_words_learned',
      'current_streak',
      'longest_streak',
      'last_study_date',
      'xp',
      'level',
      'daily_goal',
      'today_words_studied',
      'unlocked_levels',
    ];

    const fields: string[] = [];
    const values: (string | number | null)[] = [];

    for (const [key, value] of Object.entries(updates)) {
      if (allowedFields.includes(key) && value !== undefined) {
        fields.push(`${key} = ?`);
        values.push(value as string | number);
      }
    }

    if (fields.length === 0) return;

    fields.push('updated_at = CURRENT_TIMESTAMP');
    values.push(userId);

    db.run(`UPDATE user_progress SET ${fields.join(', ')} WHERE user_id = ?`, values);
    save();
  }

  // Leitner methods
  getLeitnerData(userId: string): LeitnerData[] {
    const db = getDb();
    const result = db.exec('SELECT * FROM leitner_data WHERE user_id = ?', [userId]);
    if (result.length === 0) return [];
    return result[0].values.map((row: unknown[]) => rowToObject<LeitnerData>(result[0].columns, row));
  }

  getLeitnerDataForWord(userId: string, wordId: number): LeitnerData | undefined {
    const db = getDb();
    const result = db.exec('SELECT * FROM leitner_data WHERE user_id = ? AND word_id = ?', [userId, wordId]);
    if (result.length === 0 || result[0].values.length === 0) return undefined;
    return rowToObject<LeitnerData>(result[0].columns, result[0].values[0]);
  }

  upsertLeitnerData(
    userId: string,
    wordId: number,
    box: number,
    lastReview: string,
    nextReview: string,
    correctCount: number,
    wrongCount: number
  ): void {
    const db = getDb();
    db.run(
      `INSERT INTO leitner_data (user_id, word_id, box, last_review, next_review, correct_count, wrong_count)
       VALUES (?, ?, ?, ?, ?, ?, ?)
       ON CONFLICT(user_id, word_id) DO UPDATE SET
         box = excluded.box,
         last_review = excluded.last_review,
         next_review = excluded.next_review,
         correct_count = excluded.correct_count,
         wrong_count = excluded.wrong_count,
         updated_at = CURRENT_TIMESTAMP`,
      [userId, wordId, box, lastReview, nextReview, correctCount, wrongCount]
    );
    save();
  }

  // Achievements
  getAchievements(userId: string): { achievement_id: string; unlocked_at: string }[] {
    const db = getDb();
    const result = db.exec('SELECT achievement_id, unlocked_at FROM user_achievements WHERE user_id = ?', [userId]);
    if (result.length === 0) return [];
    return result[0].values.map((row: unknown[]) => ({
      achievement_id: row[0] as string,
      unlocked_at: row[1] as string
    }));
  }

  addAchievement(userId: string, achievementId: string): void {
    const db = getDb();
    db.run(
      `INSERT OR IGNORE INTO user_achievements (user_id, achievement_id) VALUES (?, ?)`,
      [userId, achievementId]
    );
    save();
  }

  // Study sessions
  addStudySession(
    userId: string,
    date: string,
    wordsStudied: number,
    correctCount: number,
    wrongCount: number,
    duration: number,
    mode: string
  ): void {
    const db = getDb();
    db.run(
      `INSERT INTO study_sessions (user_id, date, words_studied, correct_count, wrong_count, duration, mode)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [userId, date, wordsStudied, correctCount, wrongCount, duration, mode]
    );
    save();
  }

  getStudySessions(userId: string, limit = 30): { date: string; words_studied: number; correct_count: number; wrong_count: number; duration: number; mode: string }[] {
    const db = getDb();
    const result = db.exec(
      `SELECT date, words_studied, correct_count, wrong_count, duration, mode
       FROM study_sessions
       WHERE user_id = ?
       ORDER BY created_at DESC
       LIMIT ?`,
      [userId, limit]
    );
    if (result.length === 0) return [];
    return result[0].values.map((row: unknown[]) => ({
      date: row[0] as string,
      words_studied: row[1] as number,
      correct_count: row[2] as number,
      wrong_count: row[3] as number,
      duration: row[4] as number,
      mode: row[5] as string
    }));
  }

  // Stats
  getStats(userId: string): {
    totalLearned: number;
    masteredCount: number;
    totalCorrect: number;
    totalWrong: number;
    boxes: Record<number, number>;
  } {
    const leitnerData = this.getLeitnerData(userId);

    const boxes: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    let totalCorrect = 0;
    let totalWrong = 0;

    for (const data of leitnerData) {
      boxes[data.box] = (boxes[data.box] || 0) + 1;
      totalCorrect += data.correct_count;
      totalWrong += data.wrong_count;
    }

    return {
      totalLearned: leitnerData.length,
      masteredCount: boxes[5],
      totalCorrect,
      totalWrong,
      boxes,
    };
  }
}

export default new UserModel();
