'use client';
import { useCallback, useMemo } from 'react';
import { useLocalStorage } from './useLocalStorage';
import {
  UserProgress,
  Achievement,
  ACHIEVEMENTS,
  XP_PER_LEVEL,
  XP_PER_CORRECT,
  XP_PER_WRONG,
  DAILY_GOAL_DEFAULT,
  StudySession,
} from '@/types';

const DEFAULT_PROGRESS: UserProgress = {
  totalWordsLearned: 0,
  currentStreak: 0,
  longestStreak: 0,
  lastStudyDate: '',
  xp: 0,
  level: 1,
  dailyGoal: DAILY_GOAL_DEFAULT,
  todayWordsStudied: 0,
  achievements: [],
  unlockedLevels: [1],
};

export function useProgress() {
  const [progress, setProgress] = useLocalStorage<UserProgress>('user-progress', DEFAULT_PROGRESS);
  const [studySessions, setStudySessions] = useLocalStorage<StudySession[]>('study-sessions', []);

  const getToday = useCallback((): string => {
    return new Date().toISOString().split('T')[0];
  }, []);

  const checkAndUpdateStreak = useCallback(() => {
    const today = getToday();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    setProgress((prev) => {
      if (prev.lastStudyDate === today) {
        return prev;
      }

      let newStreak = prev.currentStreak;
      let todayWords = 0;

      if (prev.lastStudyDate === yesterdayStr) {
        newStreak = prev.currentStreak + 1;
      } else if (prev.lastStudyDate !== today) {
        newStreak = 1;
      }

      if (prev.lastStudyDate !== today) {
        todayWords = 0;
      }

      return {
        ...prev,
        currentStreak: newStreak,
        longestStreak: Math.max(prev.longestStreak, newStreak),
        lastStudyDate: today,
        todayWordsStudied: todayWords,
      };
    });
  }, [getToday, setProgress]);

  const addXP = useCallback(
    (amount: number): { leveledUp: boolean; newLevel: number } => {
      let leveledUp = false;
      let newLevel = progress.level;

      setProgress((prev) => {
        const newXP = prev.xp + amount;
        const currentLevel = Math.floor(newXP / XP_PER_LEVEL) + 1;

        if (currentLevel > prev.level) {
          leveledUp = true;
          newLevel = currentLevel;
        }

        const newUnlockedLevels = [...prev.unlockedLevels];
        for (let i = 1; i <= Math.min(currentLevel, 5); i++) {
          if (!newUnlockedLevels.includes(i)) {
            newUnlockedLevels.push(i);
          }
        }

        return {
          ...prev,
          xp: newXP,
          level: currentLevel,
          unlockedLevels: newUnlockedLevels,
        };
      });

      return { leveledUp, newLevel };
    },
    [progress.level, setProgress]
  );

  const recordCorrect = useCallback(() => {
    checkAndUpdateStreak();
    const result = addXP(XP_PER_CORRECT);

    setProgress((prev) => ({
      ...prev,
      totalWordsLearned: prev.totalWordsLearned + 1,
      todayWordsStudied: prev.todayWordsStudied + 1,
    }));

    return result;
  }, [checkAndUpdateStreak, addXP, setProgress]);

  const recordWrong = useCallback(() => {
    checkAndUpdateStreak();
    addXP(XP_PER_WRONG);
  }, [checkAndUpdateStreak, addXP]);

  const unlockAchievement = useCallback(
    (achievementId: string): Achievement | null => {
      const achievement = ACHIEVEMENTS.find((a) => a.id === achievementId);
      if (!achievement) return null;

      const alreadyUnlocked = progress.achievements.some((a) => a.id === achievementId);
      if (alreadyUnlocked) return null;

      const unlockedAchievement = {
        ...achievement,
        unlockedAt: new Date().toISOString(),
      };

      setProgress((prev) => ({
        ...prev,
        achievements: [...prev.achievements, unlockedAchievement],
      }));

      return unlockedAchievement;
    },
    [progress.achievements, setProgress]
  );

  const checkAchievements = useCallback((): Achievement[] => {
    const newAchievements: Achievement[] = [];

    const checks: { id: string; condition: boolean }[] = [
      { id: 'first_word', condition: progress.totalWordsLearned >= 1 },
      { id: 'ten_words', condition: progress.totalWordsLearned >= 10 },
      { id: 'fifty_words', condition: progress.totalWordsLearned >= 50 },
      { id: 'hundred_words', condition: progress.totalWordsLearned >= 100 },
      { id: 'streak_3', condition: progress.currentStreak >= 3 },
      { id: 'streak_7', condition: progress.currentStreak >= 7 },
      { id: 'streak_30', condition: progress.currentStreak >= 30 },
      { id: 'level_2', condition: progress.unlockedLevels.includes(2) },
      { id: 'level_3', condition: progress.unlockedLevels.includes(3) },
      { id: 'level_4', condition: progress.unlockedLevels.includes(4) },
      { id: 'level_5', condition: progress.unlockedLevels.includes(5) },
    ];

    checks.forEach(({ id, condition }) => {
      if (condition) {
        const unlocked = unlockAchievement(id);
        if (unlocked) newAchievements.push(unlocked);
      }
    });

    return newAchievements;
  }, [progress, unlockAchievement]);

  const setDailyGoal = useCallback(
    (goal: number) => {
      setProgress((prev) => ({
        ...prev,
        dailyGoal: goal,
      }));
    },
    [setProgress]
  );

  const addStudySession = useCallback(
    (session: Omit<StudySession, 'date'>) => {
      const today = getToday();
      setStudySessions((prev) => [
        ...prev,
        {
          ...session,
          date: today,
        },
      ]);
    },
    [getToday, setStudySessions]
  );

  const dailyProgress = useMemo(() => {
    const percentage = Math.min((progress.todayWordsStudied / progress.dailyGoal) * 100, 100);
    return {
      current: progress.todayWordsStudied,
      goal: progress.dailyGoal,
      percentage,
      completed: progress.todayWordsStudied >= progress.dailyGoal,
    };
  }, [progress.todayWordsStudied, progress.dailyGoal]);

  const xpProgress = useMemo(() => {
    const currentLevelXP = (progress.level - 1) * XP_PER_LEVEL;
    const xpInCurrentLevel = progress.xp - currentLevelXP;
    const percentage = (xpInCurrentLevel / XP_PER_LEVEL) * 100;
    return {
      current: xpInCurrentLevel,
      needed: XP_PER_LEVEL,
      percentage,
      totalXP: progress.xp,
    };
  }, [progress.xp, progress.level]);

  const resetProgress = useCallback(() => {
    setProgress(DEFAULT_PROGRESS);
    setStudySessions([]);
  }, [setProgress, setStudySessions]);

  const unlockLevel = useCallback(
    (level: number) => {
      setProgress((prev) => {
        if (prev.unlockedLevels.includes(level)) return prev;
        return {
          ...prev,
          unlockedLevels: [...prev.unlockedLevels, level].sort((a, b) => a - b),
        };
      });
    },
    [setProgress]
  );

  return {
    progress,
    studySessions,
    recordCorrect,
    recordWrong,
    unlockAchievement,
    checkAchievements,
    setDailyGoal,
    addStudySession,
    dailyProgress,
    xpProgress,
    resetProgress,
    unlockLevel,
  };
}
