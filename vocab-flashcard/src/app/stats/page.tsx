'use client';

import { useMemo, useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import { ArrowLeft, Trophy, Target, BookOpen, Brain } from 'lucide-react';
import Link from 'next/link';
import { words } from '@/data/words';
import { AchievementList, StreakCounter } from '@/components';
import { useProgress } from '@/hooks/useProgress';
import { useLeitner } from '@/hooks/useLeitner';
import { ACHIEVEMENTS, LEVEL_NAMES } from '@/types';
import { getWordsByLevel, getLevelGradient } from '@/utils';

// Dynamic imports for heavy chart components
const BoxChart = dynamic(() => import('@/components/StatsChart').then(mod => ({ default: mod.BoxChart })), {
  loading: () => <div className="h-64 flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500" /></div>,
  ssr: false
});

const AccuracyPieChart = dynamic(() => import('@/components/StatsChart').then(mod => ({ default: mod.AccuracyPieChart })), {
  loading: () => <div className="h-64 flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500" /></div>,
  ssr: false
});

export default function StatsPage() {
  const [mounted, setMounted] = useState(false);
  const { progress, dailyProgress, xpProgress } = useProgress();
  const { stats, leitnerData } = useLeitner();

  useEffect(() => {
    setMounted(true);
  }, []);

  const wordCountByLevel = useMemo(() => {
    const counts: Record<number, number> = {};
    for (let i = 1; i <= 5; i++) {
      counts[i] = getWordsByLevel(words, i).length;
    }
    return counts;
  }, []);

  const learnedByLevel = useMemo(() => {
    const counts: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    Object.keys(leitnerData).forEach((wordId) => {
      const word = words.find((w) => w.id === parseInt(wordId));
      if (word) {
        counts[word.level]++;
      }
    });
    return counts;
  }, [leitnerData]);

  // SSR 로딩 스켈레톤 - hydration 불일치 방지
  if (!mounted) {
    return (
      <div className="min-h-screen pb-24">
        <header className="sticky top-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-700/50">
          <div className="max-w-lg mx-auto px-4 py-3 flex items-center justify-between">
            <div className="p-2 -ml-2 rounded-xl">
              <ArrowLeft className="w-5 h-5 text-slate-600 dark:text-slate-300" />
            </div>
            <h1 className="text-lg font-bold text-slate-800 dark:text-white">학습 통계</h1>
            <div className="w-9" />
          </div>
        </header>
        <div className="max-w-lg mx-auto px-4 py-6 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-24">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-700/50">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="p-2 -ml-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
            <ArrowLeft className="w-5 h-5 text-slate-600 dark:text-slate-300" />
          </Link>
          <h1 className="text-lg font-bold text-slate-800 dark:text-white">학습 통계</h1>
          <div className="w-9" />
        </div>
      </header>

      <div className="max-w-lg mx-auto px-4 py-6 space-y-6">
        {/* Streak */}
        <StreakCounter streak={progress.currentStreak} longestStreak={progress.longestStreak} />

        {/* Daily Progress */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-sm"
        >
          <div className="flex items-center gap-3 mb-3">
            <Target className="w-5 h-5 text-indigo-500" />
            <h3 className="font-bold text-slate-800 dark:text-white">오늘의 목표</h3>
          </div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-600 dark:text-slate-300">
              {dailyProgress.current} / {dailyProgress.goal} 단어
            </span>
            <span className="text-indigo-500 font-bold">{Math.round(dailyProgress.percentage)}%</span>
          </div>
          <div className="w-full h-3 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${dailyProgress.percentage}%` }}
              className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
            />
          </div>
          {dailyProgress.completed && (
            <p className="text-green-500 font-medium mt-2 text-center">오늘 목표 달성!</p>
          )}
        </motion.div>

        {/* XP & Level */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-4 text-white"
        >
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-indigo-200 text-sm">현재 레벨</p>
              <p className="text-3xl font-bold">Lv. {progress.level}</p>
            </div>
            <div className="text-right">
              <p className="text-indigo-200 text-sm">총 XP</p>
              <p className="text-2xl font-bold">{xpProgress.totalXP}</p>
            </div>
          </div>
          <div className="w-full h-2 bg-white/30 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${xpProgress.percentage}%` }}
              className="h-full bg-white rounded-full"
            />
          </div>
          <p className="text-indigo-200 text-sm mt-2 text-center">
            다음 레벨까지 {xpProgress.needed - xpProgress.current} XP
          </p>
        </motion.div>

        {/* Overview Stats */}
        <div className="grid grid-cols-3 gap-3">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white dark:bg-slate-800 rounded-2xl p-4 text-center"
          >
            <BookOpen className="w-6 h-6 text-blue-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-slate-800 dark:text-white">{stats.totalLearned}</p>
            <p className="text-xs text-slate-500">학습한 단어</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white dark:bg-slate-800 rounded-2xl p-4 text-center"
          >
            <Brain className="w-6 h-6 text-green-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-slate-800 dark:text-white">{stats.masteredCount}</p>
            <p className="text-xs text-slate-500">완전 암기</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white dark:bg-slate-800 rounded-2xl p-4 text-center"
          >
            <Trophy className="w-6 h-6 text-yellow-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-slate-800 dark:text-white">{progress.achievements.length}</p>
            <p className="text-xs text-slate-500">업적</p>
          </motion.div>
        </div>

        {/* Level Progress */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white dark:bg-slate-800 rounded-2xl p-4"
        >
          <h3 className="font-bold text-slate-800 dark:text-white mb-4">레벨별 진행률</h3>
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((level) => {
              const total = wordCountByLevel[level];
              const learned = learnedByLevel[level];
              const percentage = total > 0 ? Math.round((learned / total) * 100) : 0;
              const isUnlocked = progress.unlockedLevels.includes(level);

              return (
                <div key={level} className={!isUnlocked ? 'opacity-50' : ''}>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="font-medium text-slate-700 dark:text-slate-200">
                      Level {level} - {LEVEL_NAMES[level]}
                    </span>
                    <span className="text-slate-500">
                      {learned} / {total} ({percentage}%)
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      className={`h-full rounded-full bg-gradient-to-r ${getLevelGradient(level)}`}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Box Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white dark:bg-slate-800 rounded-2xl p-4"
        >
          <h3 className="font-bold text-slate-800 dark:text-white mb-4">라이트너 박스 분포</h3>
          <BoxChart stats={stats} />
        </motion.div>

        {/* Accuracy Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-white dark:bg-slate-800 rounded-2xl p-4"
        >
          <h3 className="font-bold text-slate-800 dark:text-white mb-4">정답률</h3>
          <AccuracyPieChart stats={stats} />
        </motion.div>

        {/* Achievements */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-white dark:bg-slate-800 rounded-2xl p-4"
        >
          <div className="flex items-center gap-2 mb-4">
            <Trophy className="w-5 h-5 text-yellow-500" />
            <h3 className="font-bold text-slate-800 dark:text-white">업적</h3>
            <span className="text-sm text-slate-500">
              {progress.achievements.length} / {ACHIEVEMENTS.length}
            </span>
          </div>
          <AchievementList achievements={progress.achievements} allAchievements={ACHIEVEMENTS} />
        </motion.div>
      </div>
    </div>
  );
}
