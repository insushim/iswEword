'use client';

import { useState, useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

interface AuthResponse {
  token: string;
  user: {
    id: string;
    username: string;
    email: string | null;
  };
  message?: string;
}

interface UserData {
  user: {
    id: string;
    username: string;
    email: string | null;
    createdAt: string;
  };
  progress: {
    totalWordsLearned: number;
    currentStreak: number;
    longestStreak: number;
    lastStudyDate: string | null;
    xp: number;
    level: number;
    dailyGoal: number;
    todayWordsStudied: number;
    unlockedLevels: number[];
  } | null;
  achievements: { id: string; unlockedAt: string }[];
  stats: {
    totalLearned: number;
    masteredCount: number;
    totalCorrect: number;
    totalWrong: number;
    boxes: Record<number, number>;
  };
}

export function useApi() {
  const [token, setToken] = useLocalStorage<string | null>('auth-token', null);
  const [user, setUser] = useLocalStorage<{ id: string; username: string } | null>('auth-user', null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const request = useCallback(
    async <T>(
      endpoint: string,
      options: RequestInit = {}
    ): Promise<T> => {
      setLoading(true);
      setError(null);

      try {
        const headers: HeadersInit = {
          'Content-Type': 'application/json',
          ...options.headers,
        };

        if (token) {
          (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch(`${API_URL}${endpoint}`, {
          ...options,
          headers,
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || '요청 처리 중 오류가 발생했습니다.');
        }

        return data as T;
      } catch (err) {
        const message = err instanceof Error ? err.message : '알 수 없는 오류';
        setError(message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [token]
  );

  const register = useCallback(
    async (username: string, password: string, email?: string) => {
      const data = await request<AuthResponse>('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ username, password, email }),
      });

      setToken(data.token);
      setUser({ id: data.user.id, username: data.user.username });

      return data;
    },
    [request, setToken, setUser]
  );

  const login = useCallback(
    async (username: string, password: string) => {
      const data = await request<AuthResponse>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ username, password }),
      });

      setToken(data.token);
      setUser({ id: data.user.id, username: data.user.username });

      return data;
    },
    [request, setToken, setUser]
  );

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
  }, [setToken, setUser]);

  const getMe = useCallback(async () => {
    return await request<UserData>('/auth/me');
  }, [request]);

  const syncProgress = useCallback(
    async (data: {
      progress?: Record<string, unknown>;
      leitnerData?: Record<string, unknown>;
      achievements?: { id: string }[];
    }) => {
      return await request<{ message: string }>('/progress/sync', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },
    [request]
  );

  const recordAnswer = useCallback(
    async (wordId: number, correct: boolean) => {
      return await request<{
        message: string;
        xpGained: number;
        newBox: number;
        levelUp: number | null;
      }>('/progress/answer', {
        method: 'POST',
        body: JSON.stringify({ wordId, correct }),
      });
    },
    [request]
  );

  const getStats = useCallback(async () => {
    return await request<{
      totalLearned: number;
      masteredCount: number;
      totalCorrect: number;
      totalWrong: number;
      boxes: Record<number, number>;
      recentSessions: {
        date: string;
        words_studied: number;
        correct_count: number;
        wrong_count: number;
      }[];
    }>('/progress/stats');
  }, [request]);

  const addAchievement = useCallback(
    async (achievementId: string) => {
      return await request<{ message: string }>('/progress/achievement', {
        method: 'POST',
        body: JSON.stringify({ achievementId }),
      });
    },
    [request]
  );

  return {
    token,
    user,
    isAuthenticated: !!token,
    loading,
    error,
    register,
    login,
    logout,
    getMe,
    syncProgress,
    recordAnswer,
    getStats,
    addAchievement,
  };
}
