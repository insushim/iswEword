import { Response } from 'express';
import UserModel from '../models/User';
import { AuthRequest } from '../middleware/auth';

const BOX_INTERVALS: Record<number, number> = {
  1: 0,
  2: 2,
  3: 4,
  4: 7,
  5: 14,
};

function calculateNextReview(box: number): string {
  const today = new Date();
  today.setDate(today.getDate() + (BOX_INTERVALS[box] || 0));
  return today.toISOString().split('T')[0];
}

function getToday(): string {
  return new Date().toISOString().split('T')[0];
}

function getYesterday(): string {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return yesterday.toISOString().split('T')[0];
}

export async function getProgress(req: AuthRequest, res: Response): Promise<void> {
  try {
    const userId = req.userId!;
    const progress = UserModel.getProgress(userId);

    if (!progress) {
      res.status(404).json({ error: '진행 상황을 찾을 수 없습니다.' });
      return;
    }

    res.json({
      totalWordsLearned: progress.total_words_learned,
      currentStreak: progress.current_streak,
      longestStreak: progress.longest_streak,
      lastStudyDate: progress.last_study_date,
      xp: progress.xp,
      level: progress.level,
      dailyGoal: progress.daily_goal,
      todayWordsStudied: progress.today_words_studied,
      unlockedLevels: JSON.parse(progress.unlocked_levels),
    });
  } catch (error) {
    console.error('Get progress error:', error);
    res.status(500).json({ error: '서버 오류가 발생했습니다.' });
  }
}

export async function updateProgress(req: AuthRequest, res: Response): Promise<void> {
  try {
    const userId = req.userId!;
    const updates = req.body;

    // Convert camelCase to snake_case
    const dbUpdates: Record<string, string | number> = {};
    if (updates.totalWordsLearned !== undefined) dbUpdates.total_words_learned = updates.totalWordsLearned;
    if (updates.currentStreak !== undefined) dbUpdates.current_streak = updates.currentStreak;
    if (updates.longestStreak !== undefined) dbUpdates.longest_streak = updates.longestStreak;
    if (updates.lastStudyDate !== undefined) dbUpdates.last_study_date = updates.lastStudyDate;
    if (updates.xp !== undefined) dbUpdates.xp = updates.xp;
    if (updates.level !== undefined) dbUpdates.level = updates.level;
    if (updates.dailyGoal !== undefined) dbUpdates.daily_goal = updates.dailyGoal;
    if (updates.todayWordsStudied !== undefined) dbUpdates.today_words_studied = updates.todayWordsStudied;
    if (updates.unlockedLevels !== undefined) dbUpdates.unlocked_levels = JSON.stringify(updates.unlockedLevels);

    UserModel.updateProgress(userId, dbUpdates);

    res.json({ message: '진행 상황이 업데이트되었습니다.' });
  } catch (error) {
    console.error('Update progress error:', error);
    res.status(500).json({ error: '서버 오류가 발생했습니다.' });
  }
}

export async function recordAnswer(req: AuthRequest, res: Response): Promise<void> {
  try {
    const userId = req.userId!;
    const { wordId, correct } = req.body;

    if (wordId === undefined || correct === undefined) {
      res.status(400).json({ error: '단어 ID와 정답 여부가 필요합니다.' });
      return;
    }

    const today = getToday();
    const yesterday = getYesterday();
    const progress = UserModel.getProgress(userId);

    if (!progress) {
      res.status(404).json({ error: '진행 상황을 찾을 수 없습니다.' });
      return;
    }

    // Get current leitner data
    const leitnerData = UserModel.getLeitnerDataForWord(userId, wordId);

    let newBox: number;
    let correctCount: number;
    let wrongCount: number;

    if (leitnerData) {
      if (correct) {
        newBox = Math.min(leitnerData.box + 1, 5);
        correctCount = leitnerData.correct_count + 1;
        wrongCount = leitnerData.wrong_count;
      } else {
        newBox = 1;
        correctCount = leitnerData.correct_count;
        wrongCount = leitnerData.wrong_count + 1;
      }
    } else {
      newBox = correct ? 2 : 1;
      correctCount = correct ? 1 : 0;
      wrongCount = correct ? 0 : 1;
    }

    // Update leitner data
    UserModel.upsertLeitnerData(
      userId,
      wordId,
      newBox,
      today,
      calculateNextReview(newBox),
      correctCount,
      wrongCount
    );

    // Update progress
    const updates: Record<string, string | number> = {};

    // XP
    const xpGain = correct ? 10 : 2;
    const newXP = progress.xp + xpGain;
    updates.xp = newXP;

    // Level
    const newLevel = Math.floor(newXP / 100) + 1;
    if (newLevel !== progress.level) {
      updates.level = newLevel;
    }

    // Streak
    if (progress.last_study_date !== today) {
      if (progress.last_study_date === yesterday) {
        const newStreak = progress.current_streak + 1;
        updates.current_streak = newStreak;
        if (newStreak > progress.longest_streak) {
          updates.longest_streak = newStreak;
        }
      } else {
        updates.current_streak = 1;
      }
      updates.today_words_studied = 0;
    }

    updates.last_study_date = today;

    // Words studied
    if (correct) {
      updates.total_words_learned = progress.total_words_learned + 1;
      updates.today_words_studied = (progress.last_study_date === today ? progress.today_words_studied : 0) + 1;
    }

    // Unlock levels based on XP
    const unlockedLevels = JSON.parse(progress.unlocked_levels) as number[];
    for (let i = 1; i <= Math.min(newLevel, 5); i++) {
      if (!unlockedLevels.includes(i)) {
        unlockedLevels.push(i);
      }
    }
    updates.unlocked_levels = JSON.stringify(unlockedLevels.sort((a, b) => a - b));

    UserModel.updateProgress(userId, updates);

    res.json({
      message: correct ? '정답!' : '오답',
      xpGained: xpGain,
      newBox,
      levelUp: newLevel !== progress.level ? newLevel : null,
    });
  } catch (error) {
    console.error('Record answer error:', error);
    res.status(500).json({ error: '서버 오류가 발생했습니다.' });
  }
}

export async function getLeitnerData(req: AuthRequest, res: Response): Promise<void> {
  try {
    const userId = req.userId!;
    const leitnerData = UserModel.getLeitnerData(userId);

    const result: Record<number, {
      wordId: number;
      box: number;
      lastReview: string | null;
      nextReview: string | null;
      correctCount: number;
      wrongCount: number;
    }> = {};

    for (const data of leitnerData) {
      result[data.word_id] = {
        wordId: data.word_id,
        box: data.box,
        lastReview: data.last_review,
        nextReview: data.next_review,
        correctCount: data.correct_count,
        wrongCount: data.wrong_count,
      };
    }

    res.json(result);
  } catch (error) {
    console.error('Get leitner data error:', error);
    res.status(500).json({ error: '서버 오류가 발생했습니다.' });
  }
}

export async function syncData(req: AuthRequest, res: Response): Promise<void> {
  try {
    const userId = req.userId!;
    const { progress, leitnerData, achievements } = req.body;

    // Sync progress
    if (progress) {
      const dbUpdates: Record<string, string | number> = {};
      if (progress.totalWordsLearned !== undefined) dbUpdates.total_words_learned = progress.totalWordsLearned;
      if (progress.currentStreak !== undefined) dbUpdates.current_streak = progress.currentStreak;
      if (progress.longestStreak !== undefined) dbUpdates.longest_streak = progress.longestStreak;
      if (progress.lastStudyDate !== undefined) dbUpdates.last_study_date = progress.lastStudyDate;
      if (progress.xp !== undefined) dbUpdates.xp = progress.xp;
      if (progress.level !== undefined) dbUpdates.level = progress.level;
      if (progress.dailyGoal !== undefined) dbUpdates.daily_goal = progress.dailyGoal;
      if (progress.todayWordsStudied !== undefined) dbUpdates.today_words_studied = progress.todayWordsStudied;
      if (progress.unlockedLevels !== undefined) dbUpdates.unlocked_levels = JSON.stringify(progress.unlockedLevels);

      UserModel.updateProgress(userId, dbUpdates);
    }

    // Sync leitner data
    if (leitnerData && typeof leitnerData === 'object') {
      for (const [wordIdStr, data] of Object.entries(leitnerData)) {
        const wordId = parseInt(wordIdStr);
        const d = data as {
          box: number;
          lastReview: string;
          nextReview: string;
          correctCount: number;
          wrongCount: number;
        };
        UserModel.upsertLeitnerData(
          userId,
          wordId,
          d.box,
          d.lastReview,
          d.nextReview,
          d.correctCount,
          d.wrongCount
        );
      }
    }

    // Sync achievements
    if (achievements && Array.isArray(achievements)) {
      for (const achievement of achievements) {
        if (achievement.id) {
          UserModel.addAchievement(userId, achievement.id);
        }
      }
    }

    res.json({ message: '데이터가 동기화되었습니다.' });
  } catch (error) {
    console.error('Sync data error:', error);
    res.status(500).json({ error: '서버 오류가 발생했습니다.' });
  }
}

export async function getStats(req: AuthRequest, res: Response): Promise<void> {
  try {
    const userId = req.userId!;
    const stats = UserModel.getStats(userId);
    const sessions = UserModel.getStudySessions(userId);

    res.json({
      ...stats,
      recentSessions: sessions,
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ error: '서버 오류가 발생했습니다.' });
  }
}

export async function addAchievement(req: AuthRequest, res: Response): Promise<void> {
  try {
    const userId = req.userId!;
    const { achievementId } = req.body;

    if (!achievementId) {
      res.status(400).json({ error: '업적 ID가 필요합니다.' });
      return;
    }

    UserModel.addAchievement(userId, achievementId);

    res.json({ message: '업적이 추가되었습니다.' });
  } catch (error) {
    console.error('Add achievement error:', error);
    res.status(500).json({ error: '서버 오류가 발생했습니다.' });
  }
}

export async function addStudySession(req: AuthRequest, res: Response): Promise<void> {
  try {
    const userId = req.userId!;
    const { wordsStudied, correctCount, wrongCount, duration, mode } = req.body;

    const today = getToday();
    UserModel.addStudySession(
      userId,
      today,
      wordsStudied || 0,
      correctCount || 0,
      wrongCount || 0,
      duration || 0,
      mode || 'normal'
    );

    res.json({ message: '학습 세션이 기록되었습니다.' });
  } catch (error) {
    console.error('Add study session error:', error);
    res.status(500).json({ error: '서버 오류가 발생했습니다.' });
  }
}
