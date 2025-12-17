'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Lock, Mail, LogIn, UserPlus } from 'lucide-react';
import { useApi } from '@/hooks/useApi';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function AuthModal({ isOpen, onClose, onSuccess }: AuthModalProps) {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);

  const { login, register, loading, error } = useApi();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);

    if (!username || !password) {
      setLocalError('사용자명과 비밀번호를 입력해주세요.');
      return;
    }

    if (mode === 'register' && password.length < 4) {
      setLocalError('비밀번호는 4자 이상이어야 합니다.');
      return;
    }

    try {
      if (mode === 'login') {
        await login(username, password);
      } else {
        await register(username, password, email || undefined);
      }
      onSuccess?.();
      onClose();
      resetForm();
    } catch {
      // Error is handled by useApi
    }
  };

  const resetForm = () => {
    setUsername('');
    setPassword('');
    setEmail('');
    setLocalError(null);
  };

  const toggleMode = () => {
    setMode(mode === 'login' ? 'register' : 'login');
    setLocalError(null);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm bg-white dark:bg-slate-800 rounded-3xl overflow-hidden shadow-2xl"
          >
            {/* Header */}
            <div className="relative bg-gradient-to-r from-indigo-500 to-purple-500 p-6 text-white">
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
              <h2 className="text-xl font-bold">{mode === 'login' ? '로그인' : '회원가입'}</h2>
              <p className="text-white/80 text-sm mt-1">
                {mode === 'login'
                  ? '계정에 로그인하여 진행 상황을 동기화하세요'
                  : '새 계정을 만들어 학습을 시작하세요'}
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Username */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">
                  사용자명
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="사용자명"
                    autoComplete="username"
                  />
                </div>
              </div>

              {/* Email (register only) */}
              {mode === 'register' && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">
                    이메일 (선택)
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="이메일 주소"
                      autoComplete="email"
                    />
                  </div>
                </div>
              )}

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">
                  비밀번호
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="비밀번호"
                    autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                  />
                </div>
              </div>

              {/* Error */}
              {(error || localError) && (
                <div className="p-3 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-xl text-sm">
                  {localError || error}
                </div>
              )}

              {/* Submit */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl font-medium disabled:opacity-50"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : mode === 'login' ? (
                  <>
                    <LogIn className="w-5 h-5" />
                    로그인
                  </>
                ) : (
                  <>
                    <UserPlus className="w-5 h-5" />
                    가입하기
                  </>
                )}
              </motion.button>

              {/* Toggle mode */}
              <div className="text-center">
                <button
                  type="button"
                  onClick={toggleMode}
                  className="text-sm text-indigo-500 hover:text-indigo-600 dark:text-indigo-400"
                >
                  {mode === 'login' ? '계정이 없으신가요? 회원가입' : '이미 계정이 있으신가요? 로그인'}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
