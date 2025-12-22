'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Plus, Trash2, LogIn, Sparkles } from 'lucide-react';
import { useStudent, StudentProfile } from '@/contexts/StudentContext';

export default function ProfileSelector() {
  const { profiles, currentProfile, isLoading, createProfile, selectProfile, deleteProfile, isLoggedIn } = useStudent();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newName, setNewName] = useState('');
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const isButtonDisabled = useRef(false);

  const handleCreate = () => {
    if (isButtonDisabled.current || !newName.trim()) return;
    isButtonDisabled.current = true;

    createProfile(newName.trim());
    setNewName('');
    setShowCreateForm(false);

    setTimeout(() => { isButtonDisabled.current = false; }, 400);
  };

  const handleSelect = (profileId: string) => {
    if (isButtonDisabled.current) return;
    isButtonDisabled.current = true;

    selectProfile(profileId);

    setTimeout(() => { isButtonDisabled.current = false; }, 400);
  };

  const handleDelete = (profileId: string) => {
    if (isButtonDisabled.current) return;
    isButtonDisabled.current = true;

    deleteProfile(profileId);
    setConfirmDelete(null);

    setTimeout(() => { isButtonDisabled.current = false; }, 400);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-indigo-50 via-white to-purple-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500" />
      </div>
    );
  }

  if (isLoggedIn) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-gradient-to-b from-indigo-50 via-white to-purple-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center shadow-lg shadow-indigo-500/30"
          >
            <Sparkles className="w-10 h-10 text-white" />
          </motion.div>
          <h1 className="text-3xl font-black text-slate-800 dark:text-white mb-2">
            ISW 영단어
          </h1>
          <p className="text-slate-500 dark:text-slate-400">
            나의 프로필을 선택하세요
          </p>
        </div>

        {/* Profile List */}
        {profiles.length > 0 && !showCreateForm && (
          <div className="space-y-3 mb-6">
            {profiles.map((profile) => (
              <motion.div
                key={profile.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="relative"
              >
                {confirmDelete === profile.id ? (
                  <div className="bg-red-50 dark:bg-red-900/30 rounded-2xl p-4 flex items-center justify-between">
                    <span className="text-red-700 dark:text-red-300 font-medium">
                      {profile.name} 삭제?
                    </span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setConfirmDelete(null)}
                        className="px-3 py-1.5 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-sm font-medium"
                      >
                        취소
                      </button>
                      <button
                        onClick={() => handleDelete(profile.id)}
                        className="px-3 py-1.5 rounded-lg bg-red-500 text-white text-sm font-medium"
                      >
                        삭제
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-lg shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-700 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white text-xl font-bold">
                      {profile.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-slate-800 dark:text-white">
                        {profile.name}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        마지막 학습: {formatDate(profile.lastActiveAt)}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setConfirmDelete(profile.id)}
                        className="p-2 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-500 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleSelect(profile.id)}
                        className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-bold flex items-center gap-2"
                      >
                        <LogIn className="w-4 h-4" />
                        시작
                      </motion.button>
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}

        {/* Create Form */}
        <AnimatePresence>
          {showCreateForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-6"
            >
              <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-700">
                <h3 className="font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                  <User className="w-5 h-5 text-indigo-500" />
                  새 프로필 만들기
                </h3>
                <input
                  ref={inputRef}
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
                  placeholder="이름을 입력하세요"
                  className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-white focus:border-indigo-500 outline-none transition-colors mb-4"
                  autoFocus
                />
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setShowCreateForm(false);
                      setNewName('');
                    }}
                    className="flex-1 py-3 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold"
                  >
                    취소
                  </button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleCreate}
                    disabled={!newName.trim()}
                    className="flex-1 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-bold disabled:opacity-50"
                  >
                    만들기
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Create Button */}
        {!showCreateForm && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowCreateForm(true)}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-bold text-lg flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/30"
          >
            <Plus className="w-6 h-6" />
            {profiles.length === 0 ? '시작하기' : '새 프로필 추가'}
          </motion.button>
        )}

        {/* Info */}
        <p className="text-center text-sm text-slate-400 dark:text-slate-500 mt-6">
          프로필을 만들면 학습 진행 상황이 저장됩니다
        </p>
      </motion.div>
    </div>
  );
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return '오늘';
  if (diffDays === 1) return '어제';
  if (diffDays < 7) return `${diffDays}일 전`;
  return date.toLocaleDateString('ko-KR');
}
