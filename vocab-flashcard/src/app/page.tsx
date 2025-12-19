'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen,
  RotateCcw,
  Brain,
  PenTool,
  Puzzle,
  Settings,
  Trophy,
  Target,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  Volume2,
  CheckCircle,
  XCircle,
  Play,
  Zap,
  Star,
  ArrowRight,
  Flame,
} from 'lucide-react';
import { words } from '@/data/words';
import { SettingsModal, AchievementBadge } from '@/components';
import { useProgress } from '@/hooks/useProgress';
import { useLeitner } from '@/hooks/useLeitner';
import { useSound } from '@/hooks/useSound';
import { useTTS } from '@/hooks/useTTS';
import { Achievement } from '@/types';
import { shuffleArray, getWordsByLevel } from '@/utils';

const menuItems = [
  {
    href: '/study',
    icon: BookOpen,
    title: '단어 학습',
    description: '플래시카드로 배워요',
    gradient: 'from-blue-500 to-cyan-400',
    shadowColor: 'shadow-blue-500/30',
  },
  {
    href: '/review',
    icon: RotateCcw,
    title: '복습하기',
    description: '복습해서 기억해요',
    gradient: 'from-emerald-500 to-teal-400',
    shadowColor: 'shadow-emerald-500/30',
  },
  {
    href: '/quiz',
    icon: Brain,
    title: '4지선다 퀴즈',
    description: '맞춰보세요!',
    gradient: 'from-violet-500 to-purple-400',
    shadowColor: 'shadow-violet-500/30',
  },
  {
    href: '/spelling',
    icon: PenTool,
    title: '받아쓰기',
    description: '직접 써보세요',
    gradient: 'from-orange-500 to-amber-400',
    shadowColor: 'shadow-orange-500/30',
  },
  {
    href: '/matching',
    icon: Puzzle,
    title: '매칭 게임',
    description: '짝을 찾아요',
    gradient: 'from-pink-500 to-rose-400',
    shadowColor: 'shadow-pink-500/30',
  },
];

export default function HomePage() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [showAchievement, setShowAchievement] = useState(false);
  const [newAchievement, setNewAchievement] = useState<Achievement | null>(null);
  const [showMenu, setShowMenu] = useState(false);

  // Quick study state
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [roundKey, setRoundKey] = useState(0);

  const { progress, dailyProgress, xpProgress, recordCorrect, checkAchievements } = useProgress();
  const { getDueWords, stats, markCorrect } = useLeitner();
  const { playSound } = useSound();
  const { speak } = useTTS();

  const dueWordsCount = useMemo(() => getDueWords(words).length, [getDueWords]);

  // Initialize quick study words using useMemo
  const quickStudyWords = useMemo(() => {
    const levelWords = getWordsByLevel(words, progress.unlockedLevels[progress.unlockedLevels.length - 1] || 1);
    return shuffleArray(levelWords).slice(0, 10);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [progress.unlockedLevels, roundKey]);

  const currentWord = quickStudyWords[currentIndex];

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
    playSound('flip');
  };

  const handleSpeak = () => {
    if (currentWord) {
      speak(currentWord.english);
    }
  };

  const handleKnow = () => {
    if (!currentWord) return;
    playSound('correct');
    markCorrect(currentWord.id);
    recordCorrect();
    moveToNext();
  };

  const handleDontKnow = () => {
    playSound('flip');
    setIsFlipped(true);
  };

  const moveToNext = () => {
    setIsFlipped(false);
    if (currentIndex < quickStudyWords.length - 1) {
      setTimeout(() => setCurrentIndex(prev => prev + 1), 200);
    } else {
      // Completed all cards
      playSound('complete');
      const achievements = checkAchievements();
      if (achievements.length > 0) {
        setNewAchievement(achievements[0]);
        setShowAchievement(true);
        playSound('achievement');
      }
      // Reset for new round
      setRoundKey(prev => prev + 1);
      setCurrentIndex(0);
    }
  };

  const handlePrevCard = () => {
    if (currentIndex > 0) {
      setIsFlipped(false);
      setCurrentIndex(prev => prev - 1);
    }
  };

  const handleNextCard = () => {
    if (currentIndex < quickStudyWords.length - 1) {
      setIsFlipped(false);
      setCurrentIndex(prev => prev + 1);
    }
  };

  return (
    <div className="min-h-screen pb-24 bg-gradient-to-b from-indigo-50 via-white to-purple-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800">
      {/* Compact Header */}
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-700/50">
        <div className="max-w-lg mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 text-white">
                <Flame className="w-4 h-4" />
                <span className="font-bold text-sm">{progress.currentStreak}일</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white">
                <Sparkles className="w-4 h-4" />
                <span className="font-bold text-sm">Lv.{progress.level}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Link href="/stats">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                >
                  <Trophy className="w-5 h-5 text-amber-500" />
                </motion.button>
              </Link>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsSettingsOpen(true)}
                className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              >
                <Settings className="w-5 h-5 text-slate-600 dark:text-slate-300" />
              </motion.button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-lg mx-auto px-4">
        {/* Welcome Message & Guidance */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 mb-4 text-center"
        >
          <h1 className="text-2xl font-black text-slate-800 dark:text-white mb-1">
            오늘의 영단어 학습
          </h1>
          <p className="text-slate-500 dark:text-slate-400">
            카드를 탭해서 뜻을 확인하세요!
          </p>
        </motion.div>

        {/* Quick Daily Progress */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6 bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-lg shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-700"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5 text-indigo-500" />
              <span className="font-bold text-slate-700 dark:text-white">오늘 목표</span>
            </div>
            <span className="text-sm font-medium text-slate-500">
              {dailyProgress.current} / {dailyProgress.goal}
            </span>
          </div>
          <div className="h-3 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${dailyProgress.percentage}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"
            />
          </div>
          {dailyProgress.completed && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-2 flex items-center justify-center gap-2 text-green-600 dark:text-green-400"
            >
              <CheckCircle className="w-4 h-4" />
              <span className="text-sm font-bold">목표 달성!</span>
            </motion.div>
          )}
        </motion.div>

        {/* Main Flashcard Area */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-6"
        >
          {/* Progress indicator */}
          <div className="flex items-center justify-center gap-2 mb-4">
            {quickStudyWords.map((_, idx) => (
              <motion.div
                key={idx}
                className={`h-2 rounded-full transition-all duration-300 ${
                  idx === currentIndex
                    ? 'w-8 bg-indigo-500'
                    : idx < currentIndex
                    ? 'w-2 bg-green-400'
                    : 'w-2 bg-slate-200 dark:bg-slate-700'
                }`}
              />
            ))}
          </div>

          {/* Flashcard */}
          {currentWord && (
            <div className="relative">
              {/* Navigation Arrows */}
              <button
                onClick={handlePrevCard}
                disabled={currentIndex === 0}
                className={`absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 z-10 p-2 rounded-full bg-white dark:bg-slate-700 shadow-lg transition-all ${
                  currentIndex === 0 ? 'opacity-30 cursor-not-allowed' : 'hover:scale-110'
                }`}
              >
                <ChevronLeft className="w-6 h-6 text-slate-600 dark:text-slate-300" />
              </button>
              <button
                onClick={handleNextCard}
                disabled={currentIndex === quickStudyWords.length - 1}
                className={`absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 z-10 p-2 rounded-full bg-white dark:bg-slate-700 shadow-lg transition-all ${
                  currentIndex === quickStudyWords.length - 1 ? 'opacity-30 cursor-not-allowed' : 'hover:scale-110'
                }`}
              >
                <ChevronRight className="w-6 h-6 text-slate-600 dark:text-slate-300" />
              </button>

              {/* The Card */}
              <div
                className="flip-card w-full aspect-[4/3] cursor-pointer mx-auto max-w-sm"
                onClick={handleFlip}
              >
                <motion.div
                  className={`flip-card-inner w-full h-full ${isFlipped ? 'flipped' : ''}`}
                  initial={false}
                >
                  {/* Front Side - English */}
                  <div className="flip-card-front w-full h-full">
                    <div className="w-full h-full rounded-3xl bg-white dark:bg-slate-800 shadow-2xl shadow-indigo-500/20 dark:shadow-none border-2 border-indigo-100 dark:border-slate-700 p-6 flex flex-col items-center justify-center relative overflow-hidden">
                      {/* Decorative gradient */}
                      <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />

                      {/* Sound button */}
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={(e) => { e.stopPropagation(); handleSpeak(); }}
                        className="absolute top-6 right-6 p-3 rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-200 dark:hover:bg-indigo-800 transition-colors"
                      >
                        <Volume2 className="w-6 h-6" />
                      </motion.button>

                      {/* Category badge */}
                      <span className="absolute top-6 left-6 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-sm font-medium">
                        {currentWord.category}
                      </span>

                      {/* Emoji */}
                      <motion.div
                        className="text-7xl mb-4"
                        animate={{ scale: [1, 1.05, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        {currentWord.emoji}
                      </motion.div>

                      {/* English word */}
                      <h2 className="text-4xl font-black text-slate-800 dark:text-white tracking-tight">
                        {currentWord.english}
                      </h2>

                      {/* Flip hint */}
                      <div className="absolute bottom-6 flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400">
                        <RotateCcw className="w-4 h-4" />
                        <span className="text-sm font-medium">탭하면 뜻이 나와요!</span>
                      </div>
                    </div>
                  </div>

                  {/* Back Side - Korean */}
                  <div className="flip-card-back w-full h-full">
                    <div className="w-full h-full rounded-3xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 shadow-2xl shadow-purple-500/30 p-6 flex flex-col items-center justify-center relative overflow-hidden">
                      {/* Pattern overlay */}
                      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRoLTJ2LTRoMnY0em0wLThoLTJ2LTRoMnY0em0tOCA4aC0ydi00aDJ2NHptMC04aC0ydi00aDJ2NHoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-50" />

                      {/* Korean meaning */}
                      <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="relative z-10 text-center"
                      >
                        <div className="text-5xl mb-2">{currentWord.emoji}</div>
                        <h2 className="text-4xl font-black text-white mb-6">
                          {currentWord.korean}
                        </h2>

                        {/* Example */}
                        <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 max-w-xs">
                          <p className="text-white text-lg font-medium mb-1">
                            {currentWord.example}
                          </p>
                          <p className="text-white/80 text-sm">
                            {currentWord.exampleKo}
                          </p>
                        </div>
                      </motion.div>

                      {/* Flip hint */}
                      <div className="absolute bottom-6 flex items-center gap-2 text-white/70">
                        <RotateCcw className="w-4 h-4" />
                        <span className="text-sm">탭해서 돌아가기</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-center gap-4 mt-6">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleDontKnow}
              className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-lg shadow-lg hover:shadow-xl transition-all"
            >
              <XCircle className="w-6 h-6 text-orange-500" />
              모르겠어요
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleKnow}
              className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-green-500 to-emerald-400 text-white font-bold text-lg shadow-lg shadow-green-500/30 hover:shadow-xl transition-all"
            >
              <CheckCircle className="w-6 h-6" />
              알아요!
            </motion.button>
          </div>
        </motion.div>

        {/* Review Alert */}
        {dueWordsCount > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Link href="/review">
              <div className="mb-6 bg-gradient-to-r from-amber-400 to-orange-500 rounded-2xl p-4 shadow-lg shadow-orange-500/30 flex items-center justify-between hover:scale-[1.02] transition-transform">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                    <RotateCcw className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="font-bold text-white text-lg">복습할 단어가 있어요!</p>
                    <p className="text-white/80 text-sm">{dueWordsCount}개 단어 복습 대기중</p>
                  </div>
                </div>
                <ChevronRight className="w-6 h-6 text-white" />
              </div>
            </Link>
          </motion.div>
        )}

        {/* More Learning Options Toggle */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowMenu(!showMenu)}
          className="w-full mb-4 p-4 rounded-2xl bg-white dark:bg-slate-800 shadow-lg shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-700 flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-slate-700 dark:text-white">다양한 학습 방법</span>
          </div>
          <motion.div
            animate={{ rotate: showMenu ? 90 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronRight className="w-5 h-5 text-slate-400" />
          </motion.div>
        </motion.button>

        {/* Expandable Menu Items */}
        <AnimatePresence>
          {showMenu && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="grid grid-cols-2 gap-3 mb-6">
                {menuItems.map((item, index) => (
                  <motion.div
                    key={item.href}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Link href={item.href}>
                      <div className={`p-4 rounded-2xl bg-gradient-to-br ${item.gradient} shadow-lg ${item.shadowColor} hover:scale-105 transition-transform h-full`}>
                        <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center mb-3">
                          <item.icon className="w-5 h-5 text-white" />
                        </div>
                        <h3 className="font-bold text-white text-lg mb-1">{item.title}</h3>
                        <p className="text-white/80 text-sm">{item.description}</p>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Stats Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="grid grid-cols-3 gap-3 mb-6"
        >
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-lg shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-700 text-center">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-cyan-400 flex items-center justify-center mx-auto mb-2">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <p className="text-2xl font-black text-slate-800 dark:text-white">{stats.totalLearned}</p>
            <p className="text-xs text-slate-500 font-medium">학습한 단어</p>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-lg shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-700 text-center">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-orange-400 flex items-center justify-center mx-auto mb-2">
              <Star className="w-5 h-5 text-white" />
            </div>
            <p className="text-2xl font-black text-slate-800 dark:text-white">{stats.masteredCount}</p>
            <p className="text-xs text-slate-500 font-medium">완전 암기</p>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-lg shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-700 text-center">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center mx-auto mb-2">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <p className="text-2xl font-black text-slate-800 dark:text-white">{xpProgress.totalXP}</p>
            <p className="text-xs text-slate-500 font-medium">획득 XP</p>
          </div>
        </motion.div>

        {/* Full Study CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Link href="/study">
            <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-2xl p-5 shadow-xl shadow-purple-500/30 flex items-center justify-between hover:scale-[1.02] transition-transform">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center">
                  <Play className="w-7 h-7 text-white ml-1" />
                </div>
                <div>
                  <h3 className="font-black text-white text-xl">본격 학습 시작</h3>
                  <p className="text-white/80">더 많은 단어를 학습하세요</p>
                </div>
              </div>
              <ArrowRight className="w-6 h-6 text-white" />
            </div>
          </Link>
        </motion.div>

        {/* Word Count Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="mt-6 text-center text-slate-400 dark:text-slate-500 text-sm"
        >
          총 {words.length}개 단어 학습 가능
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
