'use client';

import { motion } from 'framer-motion';

interface ProgressBarProps {
  progress: number;
  showPercentage?: boolean;
  height?: 'sm' | 'md' | 'lg';
  color?: 'indigo' | 'green' | 'blue' | 'orange' | 'rainbow';
}

export default function ProgressBar({
  progress,
  showPercentage = false,
  height = 'md',
  color = 'indigo',
}: ProgressBarProps) {
  const heights = {
    sm: 'h-1.5',
    md: 'h-3',
    lg: 'h-4',
  };

  const colors = {
    indigo: 'bg-gradient-to-r from-indigo-500 to-purple-500',
    green: 'bg-gradient-to-r from-green-400 to-emerald-500',
    blue: 'bg-gradient-to-r from-blue-400 to-cyan-500',
    orange: 'bg-gradient-to-r from-orange-400 to-amber-500',
    rainbow: 'bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500',
  };

  return (
    <div className="w-full">
      <div className={`w-full ${heights[height]} bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden`}>
        <motion.div
          className={`h-full ${colors[color]} rounded-full`}
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(progress, 100)}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
      </div>
      {showPercentage && (
        <div className="text-right text-sm text-slate-600 dark:text-slate-300 mt-1">
          {Math.round(progress)}%
        </div>
      )}
    </div>
  );
}
