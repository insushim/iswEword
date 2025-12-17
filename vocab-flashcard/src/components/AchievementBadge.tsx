'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { Achievement } from '@/types';

interface AchievementBadgeProps {
  achievement: Achievement;
  onClose: () => void;
  show: boolean;
}

export default function AchievementBadge({ achievement, onClose, show }: AchievementBadgeProps) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: -100, scale: 0.5 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -100, scale: 0.5 }}
          className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-full max-w-sm px-4"
        >
          <div className="relative bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl p-4 shadow-2xl">
            <button
              onClick={onClose}
              className="absolute top-2 right-2 p-1 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
            >
              <X className="w-4 h-4 text-white" />
            </button>

            <div className="flex items-center gap-4">
              <motion.div
                animate={{ rotate: [0, -10, 10, -10, 0], scale: [1, 1.2, 1] }}
                transition={{ duration: 0.5 }}
                className="text-5xl"
              >
                {achievement.emoji}
              </motion.div>

              <div className="flex-1">
                <div className="text-xs text-yellow-100 font-medium mb-1">업적 달성!</div>
                <div className="text-lg font-bold text-white">{achievement.title}</div>
                <div className="text-sm text-yellow-100">{achievement.description}</div>
              </div>
            </div>

            <motion.div
              className="absolute inset-0 rounded-2xl bg-white/20"
              animate={{ opacity: [0, 0.5, 0] }}
              transition={{ duration: 1, repeat: 2 }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

interface AchievementListProps {
  achievements: Achievement[];
  allAchievements: Achievement[];
}

export function AchievementList({ achievements, allAchievements }: AchievementListProps) {
  const unlockedIds = new Set(achievements.map((a) => a.id));

  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
      {allAchievements.map((achievement) => {
        const isUnlocked = unlockedIds.has(achievement.id);

        return (
          <motion.div
            key={achievement.id}
            whileHover={{ scale: 1.05 }}
            className={`flex flex-col items-center p-3 rounded-xl transition-all ${
              isUnlocked
                ? 'bg-gradient-to-br from-yellow-100 to-orange-100 dark:from-yellow-900/30 dark:to-orange-900/30'
                : 'bg-slate-100 dark:bg-slate-800 opacity-50'
            }`}
          >
            <div className={`text-3xl mb-1 ${!isUnlocked && 'grayscale'}`}>{achievement.emoji}</div>
            <div className="text-xs font-medium text-center text-slate-700 dark:text-slate-300 line-clamp-2">
              {achievement.title}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
