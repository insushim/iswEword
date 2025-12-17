'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { words } from '@/data/words';
import { MatchingGame, LevelSelector } from '@/components';
import { useProgress } from '@/hooks/useProgress';
import { getWordsByLevel } from '@/utils';

export default function MatchingPage() {
  const [selectedLevel, setSelectedLevel] = useState(1);
  const [pairCount, setPairCount] = useState(6);
  const [gameKey, setGameKey] = useState(0);

  const { progress, unlockAchievement } = useProgress();

  const levelWords = useMemo(() => getWordsByLevel(words, selectedLevel), [selectedLevel]);

  const handleComplete = (time: number, moves: number) => {
    if (time <= 30) {
      unlockAchievement('matching_fast');
    }
  };

  const handleLevelChange = (level: number) => {
    setSelectedLevel(level);
    setGameKey((prev) => prev + 1);
  };

  const handlePairCountChange = (count: number) => {
    setPairCount(count);
    setGameKey((prev) => prev + 1);
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-700/50">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="p-2 -ml-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
            <ArrowLeft className="w-5 h-5 text-slate-600 dark:text-slate-300" />
          </Link>
          <h1 className="text-lg font-bold text-slate-800 dark:text-white">매칭 게임</h1>
          <div className="w-9" />
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* Level Selector */}
        <div className="mb-6">
          <LevelSelector
            selectedLevel={selectedLevel}
            onSelectLevel={handleLevelChange}
            unlockedLevels={progress.unlockedLevels}
          />
        </div>

        {/* Pair Count Selector */}
        <div className="mb-6">
          <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-3">짝 개수</h3>
          <div className="flex gap-2 flex-wrap">
            {[4, 6, 8, 10].map((count) => (
              <motion.button
                key={count}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handlePairCountChange(count)}
                className={`px-4 py-2 rounded-xl font-medium transition-all ${
                  pairCount === count
                    ? 'bg-indigo-500 text-white'
                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                }`}
              >
                {count}쌍
              </motion.button>
            ))}
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-indigo-50 dark:bg-indigo-900/30 rounded-2xl p-4 mb-6">
          <h4 className="font-bold text-indigo-800 dark:text-indigo-200 mb-2">게임 방법</h4>
          <ul className="text-sm text-indigo-700 dark:text-indigo-300 space-y-1">
            <li>- 영어 단어와 한글 뜻을 찾아 매칭하세요</li>
            <li>- 30초 안에 완료하면 업적을 획득해요!</li>
          </ul>
        </div>

        {/* Game */}
        <MatchingGame
          key={gameKey}
          words={levelWords}
          pairCount={pairCount}
          onComplete={handleComplete}
        />
      </div>
    </div>
  );
}
