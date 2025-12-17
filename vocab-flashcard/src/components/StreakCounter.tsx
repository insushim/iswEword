'use client';

import { motion } from 'framer-motion';
import { Flame } from 'lucide-react';
import { getStreakEmoji } from '@/utils';

interface StreakCounterProps {
  streak: number;
  longestStreak: number;
}

export default function StreakCounter({ streak, longestStreak }: StreakCounterProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center gap-3 bg-gradient-to-r from-orange-100 to-red-100 dark:from-orange-900/30 dark:to-red-900/30 rounded-2xl p-4"
    >
      <motion.div
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 1 }}
        className="text-3xl"
      >
        {getStreakEmoji(streak)}
      </motion.div>

      <div className="flex-1">
        <div className="flex items-center gap-2">
          <Flame className="w-5 h-5 text-orange-500" />
          <span className="text-2xl font-bold text-orange-600 dark:text-orange-400">{streak}일</span>
          <span className="text-slate-600 dark:text-slate-300">연속 학습</span>
        </div>
        <div className="text-sm text-slate-500 dark:text-slate-400">
          최고 기록: {longestStreak}일
        </div>
      </div>
    </motion.div>
  );
}
