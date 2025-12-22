'use client';

import { useRef } from 'react';
import { motion } from 'framer-motion';
import { Lock, Check } from 'lucide-react';
import { LEVEL_NAMES } from '@/types';
import { getLevelGradient } from '@/utils';

interface LevelSelectorProps {
  selectedLevel: number;
  onSelectLevel: (level: number) => void;
  unlockedLevels: number[];
}

export default function LevelSelector({ selectedLevel, onSelectLevel, unlockedLevels }: LevelSelectorProps) {
  const isButtonDisabled = useRef(false);

  const handleSelect = (level: number) => {
    if (isButtonDisabled.current) return;
    isButtonDisabled.current = true;
    onSelectLevel(level);
    setTimeout(() => { isButtonDisabled.current = false; }, 400);
  };
  return (
    <div className="w-full max-w-sm mx-auto">
      <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-3">레벨 선택</h3>
      <div className="grid grid-cols-5 gap-2">
        {[1, 2, 3, 4, 5].map((level) => {
          const isUnlocked = unlockedLevels.includes(level);
          const isSelected = selectedLevel === level;

          return (
            <motion.button
              key={level}
              whileHover={isUnlocked ? { scale: 1.05 } : undefined}
              whileTap={isUnlocked ? { scale: 0.95 } : undefined}
              onClick={() => isUnlocked && handleSelect(level)}
              disabled={!isUnlocked}
              className={`relative flex flex-col items-center p-3 rounded-xl transition-all ${
                isSelected
                  ? `bg-gradient-to-br ${getLevelGradient(level)} text-white shadow-lg`
                  : isUnlocked
                  ? 'bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 shadow'
                  : 'bg-slate-100 dark:bg-slate-900 text-slate-400 dark:text-slate-600 cursor-not-allowed'
              }`}
            >
              {isSelected && (
                <motion.div
                  layoutId="level-selected"
                  className="absolute inset-0 rounded-xl bg-white/20"
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              )}

              {!isUnlocked && (
                <Lock className="absolute top-1 right-1 w-3 h-3 text-slate-400 dark:text-slate-600" />
              )}

              {isUnlocked && isSelected && (
                <Check className="absolute top-1 right-1 w-3 h-3 text-white" />
              )}

              <span className="text-xl font-bold">{level}</span>
              <span className="text-[10px] whitespace-nowrap">{LEVEL_NAMES[level]}</span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
