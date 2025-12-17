'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Settings } from 'lucide-react';
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
    <div className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-700/50">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="p-2 -ml-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
            <ArrowLeft className="w-5 h-5 text-slate-600 dark:text-slate-300" />
          </Link>
          <h1 className="text-lg font-bold text-slate-800 dark:text-white">단어 학습</h1>
          <button
            onClick={() => setIsSettingsOpen(true)}
            className="p-2 -mr-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <Settings className="w-5 h-5 text-slate-600 dark:text-slate-300" />
          </button>
        </div>
      </header>

      <div className="max-w-lg mx-auto px-4 py-6">
        {/* Level Selector */}
        <div className="mb-6">
          <LevelSelector
            selectedLevel={selectedLevel}
            onSelectLevel={setSelectedLevel}
            unlockedLevels={progress.unlockedLevels}
          />
        </div>

        {/* Word Count Selector */}
        <div className="mb-6">
          <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-3">학습 단어 수</h3>
          <div className="flex gap-2 flex-wrap">
            {[10, 20, 30, 50, 100].map((count) => (
              <motion.button
                key={count}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setWordCount(count)}
                className={`px-4 py-2 rounded-xl font-medium transition-all ${
                  wordCount === count
                    ? 'bg-indigo-500 text-white'
                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'
                }`}
              >
                {count}개
              </motion.button>
            ))}
          </div>
        </div>

        {/* Card Deck */}
        <CardDeck words={levelWords} mode="study" />
      </div>

      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
    </div>
  );
}
