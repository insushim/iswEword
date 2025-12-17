import db from '../config/database';
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

class UserModel {
  create(username: string, password: string, email?: string): User {
    const id = uuidv4();
    const password_hash = bcrypt.hashSync(password, 10);

    const stmt = db.prepare(`
      INSERT INTO users (id, username, email, password_hash)
      VALUES (?, ?, ?, ?)
    `);

    stmt.run(id, username, email || null, password_hash);

    // Create initial progress
    const progressStmt = db.prepare(`
      INSERT INTO user_progress (user_id)
      VALUES (?)
    `);
    progressStmt.run(id);

    return this.findById(id)!;
  }

  findById(id: string): User | undefined {
    const stmt = db.prepare('SELECT * FROM users WHERE id = ?');
    return stmt.get(id) as User | undefined;
  }

  findByUsername(username: string): User | undefined {
    const stmt = db.prepare('SELECT * FROM users WHERE username = ?');
    return stmt.get(username) as User | undefined;
  }

  findByEmail(email: string): User | undefined {
    const stmt = db.prepare('SELECT * FROM users WHERE email = ?');
    return stmt.get(email) as User | undefined;
  }

  verifyPassword(user: User, password: string): boolean {
    return bcrypt.compareSync(password, user.password_hash);
  }

  getProgress(userId: string): UserProgress | undefined {
    const stmt = db.prepare('SELECT * FROM user_progress WHERE user_id = ?');
    return stmt.get(userId) as UserProgress | undefined;
  }

  updateProgress(userId: string, updates: Partial<UserProgress>): void {
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
    const values: (string | number)[] = [];

    for (const [key, value] of Object.entries(updates)) {
      if (allowedFields.includes(key) && value !== undefined) {
        fields.push(`${key} = ?`);
        values.push(value as string | number);
      }
    }

    if (fields.length === 0) return;

    fields.push('updated_at = CURRENT_TIMESTAMP');
    values.push(userId);

    const stmt = db.prepare(`
      UPDATE user_progress
      SET ${fields.join(', ')}
      WHERE user_id = ?
    `);

    stmt.run(...values);
  }

  // Leitner methods
  getLeitnerData(userId: string): LeitnerData[] {
    const stmt = db.prepare('SELECT * FROM leitner_data WHERE user_id = ?');
    return stmt.all(userId) as LeitnerData[];
  }

  getLeitnerDataForWord(userId: string, wordId: number): LeitnerData | undefined {
    const stmt = db.prepare('SELECT * FROM leitner_data WHERE user_id = ? AND word_id = ?');
    return stmt.get(userId, wordId) as LeitnerData | undefined;
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
    const stmt = db.prepare(`
      INSERT INTO leitner_data (user_id, word_id, box, last_review, next_review, correct_count, wrong_count)
      VALUES (?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(user_id, word_id) DO UPDATE SET
        box = excluded.box,
        last_review = excluded.last_review,
        next_review = excluded.next_review,
        correct_count = excluded.correct_count,
        wrong_count = excluded.wrong_count,
        updated_at = CURRENT_TIMESTAMP
    `);

    stmt.run(userId, wordId, box, lastReview, nextReview, correctCount, wrongCount);
  }

  // Achievements
  getAchievements(userId: string): { achievement_id: string; unlocked_at: string }[] {
    const stmt = db.prepare('SELECT achievement_id, unlocked_at FROM user_achievements WHERE user_id = ?');
    return stmt.all(userId) as { achievement_id: string; unlocked_at: string }[];
  }

  addAchievement(userId: string, achievementId: string): void {
    const stmt = db.prepare(`
      INSERT OR IGNORE INTO user_achievements (user_id, achievement_id)
      VALUES (?, ?)
    `);
    stmt.run(userId, achievementId);
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
    const stmt = db.prepare(`
      INSERT INTO study_sessions (user_id, date, words_studied, correct_count, wrong_count, duration, mode)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    stmt.run(userId, date, wordsStudied, correctCount, wrongCount, duration, mode);
  }

  getStudySessions(userId: string, limit = 30): { date: string; words_studied: number; correct_count: number; wrong_count: number; duration: number; mode: string }[] {
    const stmt = db.prepare(`
      SELECT date, words_studied, correct_count, wrong_count, duration, mode
      FROM study_sessions
      WHERE user_id = ?
      ORDER BY created_at DESC
      LIMIT ?
    `);
    return stmt.all(userId, limit) as { date: string; words_studied: number; correct_count: number; wrong_count: number; duration: number; mode: string }[];
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
