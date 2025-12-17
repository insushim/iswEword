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
      <div className="mx-auto max-w-lg">
        <div className="mx-2 mb-2 rounded-2xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl shadow-lg border border-slate-200/50 dark:border-slate-700/50">
          <div className="flex items-center justify-around px-2 py-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;

              return (
                <Link key={item.href} href={item.href} className="relative flex flex-col items-center p-2">
                  {isActive && (
                    <motion.div
                      layoutId="nav-indicator"
                      className="absolute inset-0 rounded-xl bg-indigo-100 dark:bg-indigo-900/50"
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    />
                  )}
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="relative z-10"
                  >
                    <Icon
                      className={`w-5 h-5 transition-colors ${
                        isActive
                          ? 'text-indigo-600 dark:text-indigo-400'
                          : 'text-slate-500 dark:text-slate-400'
                      }`}
                    />
                  </motion.div>
                  <span
                    className={`relative z-10 text-[10px] mt-1 font-medium transition-colors ${
                      isActive
                        ? 'text-indigo-600 dark:text-indigo-400'
                        : 'text-slate-500 dark:text-slate-400'
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
