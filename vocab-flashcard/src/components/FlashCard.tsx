'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Volume2, RotateCcw, Sparkles } from 'lucide-react';
import { Word } from '@/types';
import { useTTS } from '@/hooks/useTTS';
import { useSound } from '@/hooks/useSound';
import { getBoxColor } from '@/utils';

interface FlashCardProps {
  word: Word;
  isFlipped: boolean;
  onFlip: () => void;
  boxLevel?: number;
  showBox?: boolean;
}

export default function FlashCard({ word, isFlipped, onFlip, boxLevel, showBox = false }: FlashCardProps) {
  const { speak } = useTTS();
  const { playSound } = useSound();
  const lastSpokenWordId = useRef<number | null>(null);

  // 단어가 바뀔 때마다 자동으로 한 번 읽어주기 (무조건 실행)
  useEffect(() => {
    // 같은 단어는 다시 읽지 않음
    if (word.id === lastSpokenWordId.current) {
      return;
    }
    lastSpokenWordId.current = word.id;

    // 카드 전환 후 약간의 딜레이를 줘서 읽기
    const timer = setTimeout(() => {
      speak(word.english);
    }, 300);

    return () => clearTimeout(timer);
  }, [word.id, word.english, speak]);

  const handleFlip = () => {
    playSound('flip');
    onFlip();
  };

  const handleSpeak = (e: React.MouseEvent) => {
    e.stopPropagation();
    speak(word.english);
  };

  return (
    <div className="flip-card w-full max-w-sm mx-auto aspect-[4/3] cursor-pointer" onClick={handleFlip}>
      <motion.div
        className={`flip-card-inner w-full h-full ${isFlipped ? 'flipped' : ''}`}
        initial={false}
      >
        {/* Front Side */}
        <div className="flip-card-front w-full h-full">
          <div className="w-full h-full rounded-3xl bg-white dark:bg-slate-800 shadow-2xl shadow-indigo-500/20 dark:shadow-none border-2 border-indigo-100 dark:border-slate-700 p-6 flex flex-col items-center justify-center relative overflow-hidden">
            {/* Decorative top gradient */}
            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />

            {/* Decorative corner elements */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-20 h-20 bg-gradient-to-br from-pink-500/5 to-orange-500/5 rounded-full translate-y-1/2 -translate-x-1/2" />

            {/* Box level badge */}
            {showBox && boxLevel && (
              <div className={`absolute top-6 left-6 px-3 py-1.5 rounded-full text-xs font-bold ${getBoxColor(boxLevel)} flex items-center gap-1`}>
                <Sparkles className="w-3 h-3" />
                Box {boxLevel}
              </div>
            )}

            {/* Category badge (when box is not shown) */}
            {!showBox && (
              <span className="absolute top-6 left-6 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-sm font-medium">
                {word.category}
              </span>
            )}

            {/* Speaker button */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleSpeak}
              className="absolute top-6 right-6 p-3 rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-200 dark:hover:bg-indigo-800 transition-colors shadow-lg"
            >
              <Volume2 className="w-6 h-6" />
            </motion.button>

            {/* Emoji */}
            <motion.div
              className="text-7xl mb-4"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity, repeatType: 'reverse' }}
            >
              {word.emoji}
            </motion.div>

            {/* English word */}
            <h2 className="text-4xl font-black text-slate-800 dark:text-white tracking-tight mb-2">{word.english}</h2>

            {/* Category (smaller, when box is shown) */}
            {showBox && (
              <span className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 text-sm">
                {word.category}
              </span>
            )}

            {/* Flip hint */}
            <div className="absolute bottom-6 flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400">
              <RotateCcw className="w-4 h-4" />
              <span className="text-sm font-medium">탭하면 뜻이 나와요!</span>
            </div>
          </div>
        </div>

        {/* Back Side */}
        <div className="flip-card-back w-full h-full">
          <div className="w-full h-full rounded-3xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 shadow-2xl shadow-purple-500/30 p-6 flex flex-col items-center justify-center relative overflow-hidden">
            {/* Pattern overlay */}
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRoLTJ2LTRoMnY0em0wLThoLTJ2LTRoMnY0em0tOCA4aC0ydi00aDJ2NHptMC04aC0ydi00aDJ2NHoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-50" />

            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />

            {/* Content */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="relative z-10 text-center"
            >
              {/* Emoji (smaller) */}
              <div className="text-5xl mb-3">{word.emoji}</div>

              {/* Korean meaning */}
              <h2 className="text-4xl font-black text-white mb-6">{word.korean}</h2>

              {/* Example sentence */}
              <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 w-full max-w-xs">
                <p className="text-white text-lg font-medium mb-1">{word.example}</p>
                <p className="text-white/80 text-sm">{word.exampleKo}</p>
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
  );
}
