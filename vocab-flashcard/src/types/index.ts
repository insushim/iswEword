export interface Word {
  id: number;
  english: string;
  korean: string;
  emoji: string;
  example: string;
  exampleKo: string;
  level: 1 | 2 | 3 | 4 | 5;
  category: string;
}

export interface LeitnerData {
  wordId: number;
  box: 1 | 2 | 3 | 4 | 5;
  lastReview: string;
  nextReview: string;
  correctCount: number;
  wrongCount: number;
}

export interface UserProgress {
  totalWordsLearned: number;
  currentStreak: number;
  longestStreak: number;
  lastStudyDate: string;
  xp: number;
  level: number;
  dailyGoal: number;
  todayWordsStudied: number;
  achievements: Achievement[];
  unlockedLevels: number[];
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  emoji: string;
  unlockedAt?: string;
}

export interface TTSSettings {
  accent: 'en-US' | 'en-GB';
  speed: number;
  autoPlay: boolean;
}

export interface StudySession {
  date: string;
  wordsStudied: number;
  correctCount: number;
  wrongCount: number;
  duration: number;
  mode: StudyMode;
}

export type StudyMode = 'normal' | 'review' | 'wrong' | 'quiz' | 'spelling' | 'matching';

export interface QuizQuestion {
  word: Word;
  options: string[];
  correctAnswer: string;
}

export interface MatchingPair {
  id: number;
  english: string;
  korean: string;
  matched: boolean;
}

export const ACHIEVEMENTS: Achievement[] = [
  { id: 'first_word', title: '첫 걸음', description: '첫 번째 단어를 학습했어요!', emoji: '🎉' },
  { id: 'ten_words', title: '열 단어 마스터', description: '10개 단어를 학습했어요!', emoji: '🌟' },
  { id: 'fifty_words', title: '단어 수집가', description: '50개 단어를 학습했어요!', emoji: '📚' },
  { id: 'hundred_words', title: '백 단어 달성', description: '100개 단어를 학습했어요!', emoji: '💯' },
  { id: 'streak_3', title: '3일 연속', description: '3일 연속 학습했어요!', emoji: '🔥' },
  { id: 'streak_7', title: '일주일 연속', description: '7일 연속 학습했어요!', emoji: '🏆' },
  { id: 'streak_30', title: '한 달 연속', description: '30일 연속 학습했어요!', emoji: '👑' },
  { id: 'quiz_perfect', title: '퀴즈 만점', description: '퀴즈에서 만점을 받았어요!', emoji: '🎯' },
  { id: 'level_2', title: '레벨 2 달성', description: '레벨 2를 해금했어요!', emoji: '⭐' },
  { id: 'level_3', title: '레벨 3 달성', description: '레벨 3를 해금했어요!', emoji: '⭐⭐' },
  { id: 'level_4', title: '레벨 4 달성', description: '레벨 4를 해금했어요!', emoji: '⭐⭐⭐' },
  { id: 'level_5', title: '레벨 5 달성', description: '최고 레벨을 해금했어요!', emoji: '🌈' },
  { id: 'box_5', title: '완전 암기', description: '첫 번째 단어를 Box 5에 올렸어요!', emoji: '🧠' },
  { id: 'spelling_master', title: '스펠링 마스터', description: '받아쓰기 10개 연속 정답!', emoji: '✍️' },
  { id: 'matching_fast', title: '빠른 매칭', description: '매칭 게임 30초 내 완료!', emoji: '⚡' },
];

export const LEVEL_NAMES: Record<number, string> = {
  1: '초등 3학년',
  2: '초등 4학년',
  3: '초등 5학년',
  4: '초등 6학년',
  5: '심화',
};

export const XP_PER_LEVEL = 100;
export const XP_PER_CORRECT = 10;
export const XP_PER_WRONG = 2;
export const DAILY_GOAL_DEFAULT = 20;
