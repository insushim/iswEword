'use client';
import { useCallback, useMemo } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { LeitnerData, Word } from '@/types';

const BOX_INTERVALS: Record<number, number> = {
  1: 0,
  2: 2,
  3: 4,
  4: 7,
  5: 14,
};

export function useLeitner() {
  const [leitnerData, setLeitnerData] = useLocalStorage<Record<number, LeitnerData>>('leitner-data', {});

  const calculateNextReview = useCallback((box: number): string => {
    const today = new Date();
    today.setDate(today.getDate() + (BOX_INTERVALS[box] || 0));
    return today.toISOString().split('T')[0];
  }, []);

  const getToday = useCallback((): string => {
    return new Date().toISOString().split('T')[0];
  }, []);

  const initializeWord = useCallback((wordId: number): LeitnerData => {
    const today = getToday();
    return {
      wordId,
      box: 1,
      lastReview: today,
      nextReview: today,
      correctCount: 0,
      wrongCount: 0,
    };
  }, [getToday]);

  const markCorrect = useCallback(
    (wordId: number) => {
      setLeitnerData((prev) => {
        const current = prev[wordId] || initializeWord(wordId);
        const newBox = Math.min(current.box + 1, 5) as 1 | 2 | 3 | 4 | 5;
        const today = getToday();
        return {
          ...prev,
          [wordId]: {
            ...current,
            box: newBox,
            lastReview: today,
            nextReview: calculateNextReview(newBox),
            correctCount: current.correctCount + 1,
          },
        };
      });
    },
    [setLeitnerData, initializeWord, getToday, calculateNextReview]
  );

  const markWrong = useCallback(
    (wordId: number) => {
      setLeitnerData((prev) => {
        const current = prev[wordId] || initializeWord(wordId);
        const today = getToday();
        return {
          ...prev,
          [wordId]: {
            ...current,
            box: 1,
            lastReview: today,
            nextReview: today,
            wrongCount: current.wrongCount + 1,
          },
        };
      });
    },
    [setLeitnerData, initializeWord, getToday]
  );

  const getDueWords = useCallback(
    (words: Word[]): Word[] => {
      const today = getToday();
      return words.filter((word) => {
        const data = leitnerData[word.id];
        return !data || data.nextReview <= today;
      });
    },
    [leitnerData, getToday]
  );

  const getWordsByBox = useCallback(
    (words: Word[], box: number): Word[] => {
      return words.filter((word) => {
        const data = leitnerData[word.id];
        return data && data.box === box;
      });
    },
    [leitnerData]
  );

  const getWordData = useCallback(
    (wordId: number): LeitnerData | null => {
      return leitnerData[wordId] || null;
    },
    [leitnerData]
  );

  const getWrongWords = useCallback(
    (words: Word[]): Word[] => {
      return words.filter((word) => {
        const data = leitnerData[word.id];
        return data && data.wrongCount > 0 && data.box < 5;
      });
    },
    [leitnerData]
  );

  const stats = useMemo(() => {
    const boxes = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    let totalCorrect = 0;
    let totalWrong = 0;

    Object.values(leitnerData).forEach((data) => {
      boxes[data.box]++;
      totalCorrect += data.correctCount;
      totalWrong += data.wrongCount;
    });

    return {
      boxes,
      totalLearned: Object.keys(leitnerData).length,
      totalCorrect,
      totalWrong,
      masteredCount: boxes[5],
    };
  }, [leitnerData]);

  const resetWord = useCallback(
    (wordId: number) => {
      setLeitnerData((prev) => {
        const newData = { ...prev };
        delete newData[wordId];
        return newData;
      });
    },
    [setLeitnerData]
  );

  const resetAllData = useCallback(() => {
    setLeitnerData({});
  }, [setLeitnerData]);

  return {
    leitnerData,
    markCorrect,
    markWrong,
    getDueWords,
    getWordsByBox,
    getWordData,
    getWrongWords,
    stats,
    resetWord,
    resetAllData,
  };
}
