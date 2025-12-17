'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, VolumeX, RotateCcw } from 'lucide-react';
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
  const { speak, settings } = useTTS();
  const { playSound } = useSound();
  const [hasSpoken, setHasSpoken] = useState(false);

  useEffect(() => {
    if (settings.autoPlay && !hasSpoken) {
      speak(word.english);
      setHasSpoken(true);
    }
  }, [word.id, settings.autoPlay, speak, hasSpoken]);

  useEffect(() => {
    setHasSpoken(false);
  }, [word.id]);

  const handleFlip = () => {
    playSound('flip');
    onFlip();
  };

  const handleSpeak = (e: React.MouseEvent) => {
    e.stopPropagation();
    speak(word.english);
  };

  return (
    <div className="flip-card w-full max-w-sm mx-auto h-72 cursor-pointer" onClick={handleFlip}>
      <motion.div
        className={`flip-card-inner w-full h-full ${isFlipped ? 'flipped' : ''}`}
        initial={false}
      >
        {/* Front Side */}
        <div className="flip-card-front w-full h-full">
          <div className="w-full h-full rounded-3xl bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 shadow-xl border border-slate-200 dark:border-slate-700 p-6 flex flex-col items-center justify-center relative overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-br from-pink-500/10 to-orange-500/10 rounded-full translate-y-1/2 -translate-x-1/2" />

            {/* Box level badge */}
            {showBox && boxLevel && (
              <div className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-bold ${getBoxColor(boxLevel)}`}>
                Box {boxLevel}
              </div>
            )}

            {/* Speaker button */}
            <button
              onClick={handleSpeak}
              className="absolute top-4 right-4 p-2 rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-200 dark:hover:bg-indigo-800/50 transition-colors"
            >
              <Volume2 className="w-5 h-5" />
            </button>

            {/* Emoji */}
            <motion.div
              className="text-6xl mb-4"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity, repeatType: 'reverse' }}
            >
              {word.emoji}
            </motion.div>

            {/* English word */}
            <h2 className="text-3xl font-bold text-slate-800 dark:text-white mb-2">{word.english}</h2>

            {/* Category */}
            <span className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-sm">
              {word.category}
            </span>

            {/* Flip hint */}
            <div className="absolute bottom-4 flex items-center gap-1 text-slate-400 text-sm">
              <RotateCcw className="w-4 h-4" />
              <span>탭하여 뒤집기</span>
            </div>
          </div>
        </div>

        {/* Back Side */}
        <div className="flip-card-back w-full h-full">
          <div className="w-full h-full rounded-3xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-xl p-6 flex flex-col items-center justify-center relative overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />

            {/* Korean meaning */}
            <h2 className="text-3xl font-bold text-white mb-4">{word.korean}</h2>

            {/* Example sentence */}
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 w-full text-center">
              <p className="text-white text-lg mb-2">{word.example}</p>
              <p className="text-white/80 text-sm">{word.exampleKo}</p>
            </div>

            {/* Flip hint */}
            <div className="absolute bottom-4 flex items-center gap-1 text-white/60 text-sm">
              <RotateCcw className="w-4 h-4" />
              <span>탭하여 뒤집기</span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
