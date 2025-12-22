'use client';

import { useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Volume2, Moon, Sun, Trash2, Download, Upload, Gauge } from 'lucide-react';
import { useTheme } from './ThemeProvider';
import { useTTS } from '@/hooks/useTTS';
import { useSound } from '@/hooks/useSound';
import { useProgress } from '@/hooks/useProgress';
import { useLeitner } from '@/hooks/useLeitner';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const isButtonDisabled = useRef(false);

  const debounce = (fn: () => void) => {
    if (isButtonDisabled.current) return;
    isButtonDisabled.current = true;
    fn();
    setTimeout(() => { isButtonDisabled.current = false; }, 400);
  };
  const { theme, setTheme, resolvedTheme } = useTheme();
  const { settings: ttsSettings, setSettings: setTTSSettings, speak } = useTTS();
  const { soundEnabled, setSoundEnabled, playSound } = useSound();
  const { progress, setDailyGoal, resetProgress } = useProgress();
  const { resetAllData } = useLeitner();

  const handleExport = () => {
    if (isButtonDisabled.current) return;
    isButtonDisabled.current = true;
    setTimeout(() => { isButtonDisabled.current = false; }, 400);
    const data = {
      leitnerData: localStorage.getItem('leitner-data'),
      userProgress: localStorage.getItem('user-progress'),
      studySessions: localStorage.getItem('study-sessions'),
      ttsSettings: localStorage.getItem('tts-settings'),
      theme: localStorage.getItem('theme'),
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `vocabulary-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = () => {
    if (isButtonDisabled.current) return;
    isButtonDisabled.current = true;
    setTimeout(() => { isButtonDisabled.current = false; }, 400);
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target?.result as string);
          if (data.leitnerData) localStorage.setItem('leitner-data', data.leitnerData);
          if (data.userProgress) localStorage.setItem('user-progress', data.userProgress);
          if (data.studySessions) localStorage.setItem('study-sessions', data.studySessions);
          if (data.ttsSettings) localStorage.setItem('tts-settings', data.ttsSettings);
          if (data.theme) localStorage.setItem('theme', data.theme);
          window.location.reload();
        } catch {
          alert('파일을 읽는 중 오류가 발생했습니다.');
        }
      };
      reader.readAsText(file);
    };
    input.click();
  };

  const handleReset = () => {
    if (isButtonDisabled.current) return;
    isButtonDisabled.current = true;
    setTimeout(() => { isButtonDisabled.current = false; }, 400);
    if (confirm('정말 모든 데이터를 초기화하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) {
      resetProgress();
      resetAllData();
      localStorage.clear();
      window.location.reload();
    }
  };

  const testTTS = () => {
    if (isButtonDisabled.current) return;
    isButtonDisabled.current = true;
    setTimeout(() => { isButtonDisabled.current = false; }, 400);
    speak('Hello! This is a test.');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md bg-white dark:bg-slate-800 rounded-t-3xl sm:rounded-3xl overflow-hidden max-h-[80vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700 sticky top-0 bg-white dark:bg-slate-800">
              <h2 className="text-lg font-bold text-slate-800 dark:text-white">설정</h2>
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
              >
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>

            <div className="p-4 space-y-6">
              {/* Theme */}
              <div>
                <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-3">테마</h3>
                <div className="grid grid-cols-3 gap-2">
                  {(['light', 'dark', 'system'] as const).map((t) => (
                    <button
                      key={t}
                      onClick={() => setTheme(t)}
                      className={`flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all ${
                        theme === t
                          ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30'
                          : 'border-slate-200 dark:border-slate-700 hover:border-slate-300'
                      }`}
                    >
                      {t === 'light' && <Sun className="w-5 h-5" />}
                      {t === 'dark' && <Moon className="w-5 h-5" />}
                      {t === 'system' && (
                        <div className="w-5 h-5 flex">
                          <Sun className="w-3 h-3" />
                          <Moon className="w-3 h-3" />
                        </div>
                      )}
                      <span className="text-xs">
                        {t === 'light' ? '라이트' : t === 'dark' ? '다크' : '시스템'}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Sound */}
              <div>
                <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-3">소리</h3>
                <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-900 rounded-xl">
                  <div className="flex items-center gap-3">
                    <Volume2 className="w-5 h-5 text-slate-500" />
                    <span className="text-slate-700 dark:text-slate-200">효과음</span>
                  </div>
                  <button
                    onClick={() => {
                      setSoundEnabled(!soundEnabled);
                      if (!soundEnabled) {
                        setTimeout(() => playSound('click'), 100);
                      }
                    }}
                    className={`w-12 h-7 rounded-full transition-colors ${
                      soundEnabled ? 'bg-indigo-500' : 'bg-slate-300 dark:bg-slate-600'
                    }`}
                  >
                    <motion.div
                      animate={{ x: soundEnabled ? 20 : 2 }}
                      className="w-6 h-6 bg-white rounded-full shadow"
                    />
                  </button>
                </div>
              </div>

              {/* TTS Settings */}
              <div>
                <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-3">발음 설정</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-900 rounded-xl">
                    <span className="text-slate-700 dark:text-slate-200">자동 발음</span>
                    <button
                      onClick={() => setTTSSettings({ ...ttsSettings, autoPlay: !ttsSettings.autoPlay })}
                      className={`w-12 h-7 rounded-full transition-colors ${
                        ttsSettings.autoPlay ? 'bg-indigo-500' : 'bg-slate-300 dark:bg-slate-600'
                      }`}
                    >
                      <motion.div
                        animate={{ x: ttsSettings.autoPlay ? 20 : 2 }}
                        className="w-6 h-6 bg-white rounded-full shadow"
                      />
                    </button>
                  </div>

                  <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-slate-700 dark:text-slate-200">발음 억양</span>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setTTSSettings({ ...ttsSettings, accent: 'en-US' })}
                          className={`px-3 py-1 rounded-lg text-sm ${
                            ttsSettings.accent === 'en-US'
                              ? 'bg-indigo-500 text-white'
                              : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                          }`}
                        >
                          미국
                        </button>
                        <button
                          onClick={() => setTTSSettings({ ...ttsSettings, accent: 'en-GB' })}
                          className={`px-3 py-1 rounded-lg text-sm ${
                            ttsSettings.accent === 'en-GB'
                              ? 'bg-indigo-500 text-white'
                              : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                          }`}
                        >
                          영국
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-slate-700 dark:text-slate-200">발음 속도</span>
                      <span className="text-sm text-slate-500">{ttsSettings.speed}x</span>
                    </div>
                    <input
                      type="range"
                      min="0.5"
                      max="2"
                      step="0.1"
                      value={ttsSettings.speed}
                      onChange={(e) => setTTSSettings({ ...ttsSettings, speed: parseFloat(e.target.value) })}
                      className="w-full accent-indigo-500"
                    />
                    <button
                      onClick={testTTS}
                      className="mt-2 w-full py-2 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-lg text-sm hover:bg-indigo-200 dark:hover:bg-indigo-900/50 transition-colors"
                    >
                      테스트
                    </button>
                  </div>
                </div>
              </div>

              {/* Daily Goal */}
              <div>
                <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-3">일일 목표</h3>
                <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-900 rounded-xl">
                  <Gauge className="w-5 h-5 text-slate-500" />
                  <span className="text-slate-700 dark:text-slate-200 flex-1">하루 단어 수</span>
                  <select
                    value={progress.dailyGoal}
                    onChange={(e) => setDailyGoal(parseInt(e.target.value))}
                    className="px-3 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200"
                  >
                    {[10, 20, 30, 50, 100].map((n) => (
                      <option key={n} value={n}>
                        {n}개
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Data Management */}
              <div>
                <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-3">데이터 관리</h3>
                <div className="space-y-2">
                  <button
                    onClick={handleExport}
                    className="w-full flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-900 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    <Download className="w-5 h-5 text-slate-500" />
                    <span>데이터 내보내기</span>
                  </button>
                  <button
                    onClick={handleImport}
                    className="w-full flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-900 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    <Upload className="w-5 h-5 text-slate-500" />
                    <span>데이터 가져오기</span>
                  </button>
                  <button
                    onClick={handleReset}
                    className="w-full flex items-center gap-3 p-3 bg-red-50 dark:bg-red-900/30 rounded-xl text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                    <span>모든 데이터 초기화</span>
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
