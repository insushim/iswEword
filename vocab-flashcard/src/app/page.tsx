'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  BookOpen,
  RotateCcw,
  Brain,
  PenTool,
  Puzzle,
  Settings,
  Trophy,
  Flame,
  Target,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { words } from '@/data/words';
import { ProgressBar, StreakCounter, SettingsModal, AchievementBadge } from '@/components';
import { useProgress } from '@/hooks/useProgress';
import { useLeitner } from '@/hooks/useLeitner';
import { useSound } from '@/hooks/useSound';
import { Achievement, LEVEL_NAMES } from '@/types';

const menuItems = [
  {
    href: '/study',
    icon: BookOpen,
    title: '단어 학습',
    description: '새로운 단어를 배워요',
    color: 'from-blue-500 to-cyan-500',
    bgColor: 'bg-blue-50 dark:bg-blue-900/30',
    iconColor: 'text-blue-500',
  },
  {
    href: '/review',
    icon: RotateCcw,
    title: '복습하기',
    description: '라이트너 박스 복습',
    color: 'from-green-500 to-emerald-500',
    bgColor: 'bg-green-50 dark:bg-green-900/30',
    iconColor: 'text-green-500',
  },
  {
    href: '/quiz',
    icon: Brain,
    title: '4지선다 퀴즈',
    description: '실력을 테스트해요',
    color: 'from-purple-500 to-pink-500',
    bgColor: 'bg-purple-50 dark:bg-purple-900/30',
    iconColor: 'text-purple-500',
  },
  {
    href: '/spelling',
    icon: PenTool,
    title: '받아쓰기',
    description: '스펠링을 연습해요',
    color: 'from-orange-500 to-amber-500',
    bgColor: 'bg-orange-50 dark:bg-orange-900/30',
    iconColor: 'text-orange-500',
  },
  {
    href: '/matching',
    icon: Puzzle,
    title: '매칭 게임',
    description: '짝을 찾아요',
    color: 'from-indigo-500 to-violet-500',
    bgColor: 'bg-indigo-50 dark:bg-indigo-900/30',
    iconColor: 'text-indigo-500',
  },
];

export default function HomePage() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [showAchievement, setShowAchievement] = useState(false);
  const [newAchievement, setNewAchievement] = useState<Achievement | null>(null);

  const { progress, dailyProgress, xpProgress, checkAchievements } = useProgress();
  const { getDueWords, stats } = useLeitner();
  const { playSound } = useSound();

  const dueWordsCount = useMemo(() => getDueWords(words).length, [getDueWords]);

  const handleMenuClick = () => {
    playSound('click');
    const achievements = checkAchievements();
    if (achievements.length > 0) {
      setNewAchievement(achievements[0]);
      setShowAchievement(true);
      playSound('achievement');
    }
  };

  return (
    <div className="min-h-screen pb-24">
      {/* Header */}
      <header className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRoLTJ2LTRoMnY0em0wLThoLTJ2LTRoMnY0em0tOCA4aC0ydi00aDJ2NHptMC04aC0ydi00aDJ2NHoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-30" />

        <div className="relative max-w-lg mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <motion.h1
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-2xl font-bold text-white"
              >
                영단어 플래시카드
              </motion.h1>
              <p className="text-white/80 text-sm">초등 영어 학습</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsSettingsOpen(true)}
              className="p-3 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-colors"
            >
              <Settings className="w-5 h-5 text-white" />
            </motion.button>
          </div>

          {/* XP & Level */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white/20 backdrop-blur-sm rounded-2xl p-4"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-yellow-300" />
                <span className="text-white font-bold">Lv. {progress.level}</span>
              </div>
              <span className="text-white/80 text-sm">{xpProgress.totalXP} XP</span>
            </div>
            <div className="w-full h-2 bg-white/30 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${xpProgress.percentage}%` }}
                className="h-full bg-yellow-400 rounded-full"
              />
            </div>
            <p className="text-white/60 text-xs mt-1 text-right">
              다음 레벨까지 {xpProgress.needed - xpProgress.current} XP
            </p>
          </motion.div>
        </div>
      </header>

      <div className="max-w-lg mx-auto px-4 -mt-4 relative z-10">
        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-3 gap-3 mb-6"
        >
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-3 shadow-lg text-center">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-900/30 mx-auto mb-2">
              <Flame className="w-5 h-5 text-orange-500" />
            </div>
            <p className="text-xl font-bold text-slate-800 dark:text-white">{progress.currentStreak}</p>
            <p className="text-xs text-slate-500">연속 학습</p>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-2xl p-3 shadow-lg text-center">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 mx-auto mb-2">
              <Target className="w-5 h-5 text-green-500" />
            </div>
            <p className="text-xl font-bold text-slate-800 dark:text-white">{dailyProgress.current}</p>
            <p className="text-xs text-slate-500">오늘 학습</p>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-2xl p-3 shadow-lg text-center">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-yellow-100 dark:bg-yellow-900/30 mx-auto mb-2">
              <Trophy className="w-5 h-5 text-yellow-500" />
            </div>
            <p className="text-xl font-bold text-slate-800 dark:text-white">{stats.masteredCount}</p>
            <p className="text-xs text-slate-500">완전 암기</p>
          </div>
        </motion.div>

        {/* Daily Goal Progress */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-lg mb-6"
        >
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-bold text-slate-800 dark:text-white">오늘의 목표</h3>
            <span className="text-sm text-slate-500">
              {dailyProgress.current} / {dailyProgress.goal}
            </span>
          </div>
          <ProgressBar progress={dailyProgress.percentage} color="rainbow" />
          {dailyProgress.completed && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-green-500 font-medium text-center mt-2 text-sm"
            >
              오늘 목표 달성!
            </motion.p>
          )}
        </motion.div>

        {/* Due Words Alert */}
        {dueWordsCount > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
          >
            <Link href="/review">
              <div className="bg-gradient-to-r from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 rounded-2xl p-4 mb-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-amber-500 flex items-center justify-center">
                    <RotateCcw className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-bold text-amber-800 dark:text-amber-200">복습할 단어가 있어요!</p>
                    <p className="text-sm text-amber-700 dark:text-amber-300">{dueWordsCount}개 단어 복습 예정</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              </div>
            </Link>
          </motion.div>
        )}

        {/* Menu Items */}
        <div className="space-y-3">
          {menuItems.map((item, index) => (
            <motion.div
              key={item.href}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + index * 0.1 }}
            >
              <Link href={item.href} onClick={handleMenuClick}>
                <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-lg hover:shadow-xl transition-all flex items-center gap-4 group">
                  <div className={`w-14 h-14 rounded-2xl ${item.bgColor} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                    <item.icon className={`w-7 h-7 ${item.iconColor}`} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-slate-800 dark:text-white">{item.title}</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{item.description}</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-400 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Stats Link */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="mt-6"
        >
          <Link href="/stats">
            <div className="bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl p-4 shadow-lg hover:shadow-xl transition-all flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center">
                <Trophy className="w-7 h-7 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-white">학습 통계</h3>
                <p className="text-sm text-white/80">내 학습 현황을 확인해요</p>
              </div>
              <ChevronRight className="w-5 h-5 text-white/80" />
            </div>
          </Link>
        </motion.div>

        {/* Unlocked Levels */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="mt-6 bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-lg"
        >
          <h3 className="font-bold text-slate-800 dark:text-white mb-3">해금된 레벨</h3>
          <div className="flex gap-2 flex-wrap">
            {[1, 2, 3, 4, 5].map((level) => {
              const isUnlocked = progress.unlockedLevels.includes(level);
              return (
                <div
                  key={level}
                  className={`px-3 py-2 rounded-xl text-sm font-medium ${
                    isUnlocked
                      ? 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300'
                      : 'bg-slate-100 dark:bg-slate-700 text-slate-400 dark:text-slate-500'
                  }`}
                >
                  Lv.{level} {LEVEL_NAMES[level]}
                  {!isUnlocked && ' 🔒'}
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Total Words Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1 }}
          className="mt-6 text-center text-slate-500 dark:text-slate-400 text-sm"
        >
          총 {words.length}개 단어 | 학습: {stats.totalLearned}개 | 암기 완료: {stats.masteredCount}개
        </motion.div>
      </div>

      {/* Settings Modal */}
      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />

      {/* Achievement Popup */}
      {newAchievement && (
        <AchievementBadge
          achievement={newAchievement}
          show={showAchievement}
          onClose={() => setShowAchievement(false)}
        />
      )}
    </div>
  );
}
