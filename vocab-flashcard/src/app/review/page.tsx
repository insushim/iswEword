'use client';

import { useState, useMemo, useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Settings, Box, AlertTriangle } from 'lucide-react';
import Link from 'next/link';
import { words } from '@/data/words';
import { CardDeck, SettingsModal } from '@/components';
import { useLeitner } from '@/hooks/useLeitner';
import { getBoxColor } from '@/utils';

type ReviewMode = 'due' | 'wrong' | 'box';

export default function ReviewPage() {
  const [reviewMode, setReviewMode] = useState<ReviewMode>('due');
  const [selectedBox, setSelectedBox] = useState<number>(1);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const isButtonDisabled = useRef(false);

  const { getDueWords, getWrongWords, getWordsByBox, stats } = useLeitner();

  const handleModeChange = (mode: ReviewMode) => {
    if (isButtonDisabled.current) return;
    isButtonDisabled.current = true;
    setReviewMode(mode);
    setTimeout(() => { isButtonDisabled.current = false; }, 400);
  };

  const handleBoxChange = (box: number) => {
    if (isButtonDisabled.current) return;
    isButtonDisabled.current = true;
    setSelectedBox(box);
    setTimeout(() => { isButtonDisabled.current = false; }, 400);
  };

  const reviewWords = useMemo(() => {
    switch (reviewMode) {
      case 'due':
        return getDueWords(words);
      case 'wrong':
        return getWrongWords(words);
      case 'box':
        return getWordsByBox(words, selectedBox);
      default:
        return [];
    }
  }, [reviewMode, selectedBox, getDueWords, getWrongWords, getWordsByBox]);

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-700/50">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="p-2 -ml-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
            <ArrowLeft className="w-5 h-5 text-slate-600 dark:text-slate-300" />
          </Link>
          <h1 className="text-lg font-bold text-slate-800 dark:text-white">복습하기</h1>
          <button
            onClick={() => setIsSettingsOpen(true)}
            className="p-2 -mr-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <Settings className="w-5 h-5 text-slate-600 dark:text-slate-300" />
          </button>
        </div>
      </header>

      <div className="max-w-lg mx-auto px-4 py-6">
        {/* Review Mode Selector */}
        <div className="mb-6">
          <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-3">복습 모드</h3>
          <div className="grid grid-cols-3 gap-2">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleModeChange('due')}
              className={`flex flex-col items-center gap-2 p-4 rounded-xl transition-all ${
                reviewMode === 'due'
                  ? 'bg-indigo-500 text-white'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'
              }`}
            >
              <Box className="w-6 h-6" />
              <span className="text-sm font-medium">오늘 복습</span>
              <span className="text-xs opacity-70">{getDueWords(words).length}개</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleModeChange('wrong')}
              className={`flex flex-col items-center gap-2 p-4 rounded-xl transition-all ${
                reviewMode === 'wrong'
                  ? 'bg-red-500 text-white'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'
              }`}
            >
              <AlertTriangle className="w-6 h-6" />
              <span className="text-sm font-medium">틀린 단어</span>
              <span className="text-xs opacity-70">{getWrongWords(words).length}개</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleModeChange('box')}
              className={`flex flex-col items-center gap-2 p-4 rounded-xl transition-all ${
                reviewMode === 'box'
                  ? 'bg-purple-500 text-white'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'
              }`}
            >
              <Box className="w-6 h-6" />
              <span className="text-sm font-medium">박스별</span>
              <span className="text-xs opacity-70">선택</span>
            </motion.button>
          </div>
        </div>

        {/* Box Selector (when box mode) */}
        {reviewMode === 'box' && (
          <div className="mb-6">
            <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-3">박스 선택</h3>
            <div className="grid grid-cols-5 gap-2">
              {[1, 2, 3, 4, 5].map((box) => (
                <motion.button
                  key={box}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleBoxChange(box)}
                  className={`flex flex-col items-center gap-1 p-3 rounded-xl transition-all ${
                    selectedBox === box
                      ? `${getBoxColor(box)} ring-2 ring-offset-2 ring-slate-400`
                      : 'bg-white dark:bg-slate-800'
                  }`}
                >
                  <span className="text-lg font-bold">{box}</span>
                  <span className="text-xs">{stats.boxes[box as 1 | 2 | 3 | 4 | 5]}개</span>
                </motion.button>
              ))}
            </div>
          </div>
        )}

        {/* Leitner Box Stats */}
        <div className="mb-6 p-4 bg-white dark:bg-slate-800 rounded-2xl">
          <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-3">라이트너 박스 현황</h3>
          <div className="space-y-2">
            {[1, 2, 3, 4, 5].map((box) => (
              <div key={box} className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold ${getBoxColor(box)}`}>
                  {box}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-600 dark:text-slate-300">
                      {box === 1 && '매일'}
                      {box === 2 && '2일 후'}
                      {box === 3 && '4일 후'}
                      {box === 4 && '7일 후'}
                      {box === 5 && '완전 암기'}
                    </span>
                    <span className="text-slate-500">{stats.boxes[box as 1 | 2 | 3 | 4 | 5]}개</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${stats.totalLearned > 0 ? (stats.boxes[box as 1 | 2 | 3 | 4 | 5] / stats.totalLearned) * 100 : 0}%` }}
                      className={`h-full rounded-full ${
                        box === 1 ? 'bg-red-400' :
                        box === 2 ? 'bg-orange-400' :
                        box === 3 ? 'bg-yellow-400' :
                        box === 4 ? 'bg-blue-400' :
                        'bg-green-400'
                      }`}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Card Deck */}
        <CardDeck words={reviewWords} mode="review" />
      </div>

      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
    </div>
  );
}
