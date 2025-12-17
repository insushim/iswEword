import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import UserModel from '../models/User';
import { AuthRequest } from '../middleware/auth';

const JWT_SECRET = process.env.JWT_SECRET || 'default-secret';
const JWT_EXPIRES_IN = '7d';

function generateToken(userId: string): string {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

export async function register(req: Request, res: Response): Promise<void> {
  try {
    const { username, password, email } = req.body;

    if (!username || !password) {
      res.status(400).json({ error: '사용자명과 비밀번호는 필수입니다.' });
      return;
    }

    if (username.length < 3) {
      res.status(400).json({ error: '사용자명은 3자 이상이어야 합니다.' });
      return;
    }

    if (password.length < 4) {
      res.status(400).json({ error: '비밀번호는 4자 이상이어야 합니다.' });
      return;
    }

    const existingUser = UserModel.findByUsername(username);
    if (existingUser) {
      res.status(400).json({ error: '이미 사용 중인 사용자명입니다.' });
      return;
    }

    if (email) {
      const existingEmail = UserModel.findByEmail(email);
      if (existingEmail) {
        res.status(400).json({ error: '이미 사용 중인 이메일입니다.' });
        return;
      }
    }

    const user = UserModel.create(username, password, email);
    const token = generateToken(user.id);

    res.status(201).json({
      message: '회원가입이 완료되었습니다.',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: '서버 오류가 발생했습니다.' });
  }
}

export async function login(req: Request, res: Response): Promise<void> {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      res.status(400).json({ error: '사용자명과 비밀번호를 입력해주세요.' });
      return;
    }

    const user = UserModel.findByUsername(username);
    if (!user) {
      res.status(401).json({ error: '사용자명 또는 비밀번호가 올바르지 않습니다.' });
      return;
    }

    const isValid = UserModel.verifyPassword(user, password);
    if (!isValid) {
      res.status(401).json({ error: '사용자명 또는 비밀번호가 올바르지 않습니다.' });
      return;
    }

    const token = generateToken(user.id);

    res.json({
      message: '로그인 성공',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: '서버 오류가 발생했습니다.' });
  }
}

export async function getMe(req: AuthRequest, res: Response): Promise<void> {
  try {
    const userId = req.userId!;
    const user = UserModel.findById(userId);

    if (!user) {
      res.status(404).json({ error: '사용자를 찾을 수 없습니다.' });
      return;
    }

    const progress = UserModel.getProgress(userId);
    const achievements = UserModel.getAchievements(userId);
    const stats = UserModel.getStats(userId);

    res.json({
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        createdAt: user.created_at,
      },
      progress: progress ? {
        totalWordsLearned: progress.total_words_learned,
        currentStreak: progress.current_streak,
        longestStreak: progress.longest_streak,
        lastStudyDate: progress.last_study_date,
        xp: progress.xp,
        level: progress.level,
        dailyGoal: progress.daily_goal,
        todayWordsStudied: progress.today_words_studied,
        unlockedLevels: JSON.parse(progress.unlocked_levels),
      } : null,
      achievements: achievements.map((a) => ({
        id: a.achievement_id,
        unlockedAt: a.unlocked_at,
      })),
      stats,
    });
  } catch (error) {
    console.error('Get me error:', error);
    res.status(500).json({ error: '서버 오류가 발생했습니다.' });
  }
}
