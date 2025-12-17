import { Word, QuizQuestion, MatchingPair } from '@/types';

export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function getRandomItems<T>(array: T[], count: number): T[] {
  const shuffled = shuffleArray(array);
  return shuffled.slice(0, count);
}

export function calculateXPForLevel(level: number): number {
  return level * 100;
}

export function getLevelFromXP(xp: number): number {
  return Math.floor(xp / 100) + 1;
}

export function formatDate(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export function generateQuizQuestions(words: Word[], count: number): QuizQuestion[] {
  const shuffledWords = shuffleArray(words);
  const questions: QuizQuestion[] = [];

  for (let i = 0; i < Math.min(count, shuffledWords.length); i++) {
    const correctWord = shuffledWords[i];
    const otherWords = shuffledWords.filter((w) => w.id !== correctWord.id);
    const wrongOptions = getRandomItems(otherWords, 3).map((w) => w.korean);
    const options = shuffleArray([correctWord.korean, ...wrongOptions]);

    questions.push({
      word: correctWord,
      options,
      correctAnswer: correctWord.korean,
    });
  }

  return questions;
}

export function generateMatchingPairs(words: Word[], count: number): MatchingPair[] {
  const selectedWords = getRandomItems(words, count);
  return selectedWords.map((word) => ({
    id: word.id,
    english: word.english,
    korean: word.korean,
    matched: false,
  }));
}

export function getWordsByLevel(words: Word[], level: number): Word[] {
  return words.filter((word) => word.level === level);
}

export function getWordsByCategory(words: Word[], category: string): Word[] {
  return words.filter((word) => word.category === category);
}

export function getCategories(words: Word[]): string[] {
  const categories = new Set(words.map((word) => word.category));
  return Array.from(categories).sort();
}

export function calculateAccuracy(correct: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((correct / total) * 100);
}

export function getStreakEmoji(streak: number): string {
  if (streak >= 30) return '👑';
  if (streak >= 14) return '🏆';
  if (streak >= 7) return '⭐';
  if (streak >= 3) return '🔥';
  if (streak >= 1) return '✨';
  return '💫';
}

export function getLevelColor(level: number): string {
  const colors: Record<number, string> = {
    1: 'bg-green-500',
    2: 'bg-blue-500',
    3: 'bg-purple-500',
    4: 'bg-orange-500',
    5: 'bg-red-500',
  };
  return colors[level] || 'bg-gray-500';
}

export function getLevelGradient(level: number): string {
  const gradients: Record<number, string> = {
    1: 'from-green-400 to-green-600',
    2: 'from-blue-400 to-blue-600',
    3: 'from-purple-400 to-purple-600',
    4: 'from-orange-400 to-orange-600',
    5: 'from-red-400 to-red-600',
  };
  return gradients[level] || 'from-gray-400 to-gray-600';
}

export function getBoxColor(box: number): string {
  const colors: Record<number, string> = {
    1: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    2: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
    3: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    4: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    5: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  };
  return colors[box] || 'bg-gray-100 text-gray-800';
}

export function debounce<T extends (...args: Parameters<T>) => void>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}
