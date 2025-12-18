'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Settings, BookOpen, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { words } from '@/data/words';
import { CardDeck, LevelSelector, SettingsModal } from '@/components';
import { useProgress } from '@/hooks/useProgress';
import { getWordsByLevel } from '@/utils';

export default function StudyPage() {
  const [selectedLevel, setSelectedLevel] = useState(1);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [wordCount, setWordCount] = useState(20);
  const { progress } = useProgress();

  const levelWords = useMemo(() => {
    const filtered = getWordsByLevel(words, selectedLevel);
    return filtered.slice(0, wordCount);
  }, [selectedLevel, wordCount]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-indigo-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-700/50">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-slate-600 dark:text-slate-300" />
            </motion.button>
          </Link>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center">
              <BookOpen className="w-4 h-4 text-white" />
            </div>
            <h1 className="text-lg font-black text-slate-800 dark:text-white">단어 학습</h1>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsSettingsOpen(true)}
            className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            <Settings className="w-5 h-5 text-slate-600 dark:text-slate-300" />
          </motion.button>
        </div>
      </header>

      <div className="max-w-lg mx-auto px-4 py-6">
        {/* Level Selector */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <LevelSelector
            selectedLevel={selectedLevel}
            onSelectLevel={setSelectedLevel}
            unlockedLevels={progress.unlockedLevels}
          />
        </motion.div>

        {/* Word Count Selector */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6 bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-lg shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-700"
        >
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-5 h-5 text-indigo-500" />
            <h3 className="font-bold text-slate-800 dark:text-white">학습 단어 수</h3>
          </div>
          <div className="flex gap-2 flex-wrap">
            {[10, 20, 30, 50, 100].map((count) => (
              <motion.button
                key={count}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setWordCount(count)}
                className={`px-4 py-2.5 rounded-xl font-bold transition-all ${
                  wordCount === count
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg shadow-indigo-500/30'
                    : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                }`}
              >
                {count}개
              </motion.button>
            ))}
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-3">
            레벨 {selectedLevel}에서 {levelWords.length}개 단어 학습
          </p>
        </motion.div>

        {/* Card Deck */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <CardDeck words={levelWords} mode="study" />
        </motion.div>
      </div>

      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
    </div>
  );
}
