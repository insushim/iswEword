'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { Home, BookOpen, RotateCcw, Brain, PenTool, Puzzle, BarChart3 } from 'lucide-react';

const navItems = [
  { href: '/', icon: Home, label: '홈' },
  { href: '/study', icon: BookOpen, label: '학습' },
  { href: '/review', icon: RotateCcw, label: '복습' },
  { href: '/quiz', icon: Brain, label: '퀴즈' },
  { href: '/spelling', icon: PenTool, label: '받아쓰기' },
  { href: '/matching', icon: Puzzle, label: '매칭' },
  { href: '/stats', icon: BarChart3, label: '통계' },
];

export default function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 safe-bottom">
      <div className="mx-auto max-w-lg px-2 pb-2">
        <div className="rounded-2xl bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl shadow-2xl shadow-slate-900/10 dark:shadow-black/30 border border-slate-200/50 dark:border-slate-700/50">
          <div className="flex items-center justify-around px-1 py-1.5">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="relative flex flex-col items-center py-1.5 px-2 min-w-[44px]"
                >
                  {isActive && (
                    <motion.div
                      layoutId="nav-indicator"
                      className="absolute inset-0 rounded-xl bg-gradient-to-r from-indigo-500/20 to-purple-500/20 dark:from-indigo-500/30 dark:to-purple-500/30"
                      transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                    />
                  )}
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="relative z-10"
                  >
                    <div className={`p-1.5 rounded-lg transition-all duration-200 ${
                      isActive
                        ? 'bg-gradient-to-r from-indigo-500 to-purple-500 shadow-lg shadow-indigo-500/30'
                        : ''
                    }`}>
                      <Icon
                        className={`w-5 h-5 transition-colors ${
                          isActive
                            ? 'text-white'
                            : 'text-slate-400 dark:text-slate-500'
                        }`}
                      />
                    </div>
                  </motion.div>
                  <span
                    className={`relative z-10 text-[9px] mt-0.5 font-semibold transition-colors ${
                      isActive
                        ? 'text-indigo-600 dark:text-indigo-400'
                        : 'text-slate-400 dark:text-slate-500'
                    }`}
                  >
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}
