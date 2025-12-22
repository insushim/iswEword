'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, Download, Copy, Check, Loader2, CloudOff, Smartphone } from 'lucide-react';
import { useSync } from '@/hooks/useSync';
import { useStudent } from '@/contexts/StudentContext';

interface SyncModalProps {
  isOpen: boolean;
  onClose: () => void;
  leitnerData: Record<string, unknown>;
  progressData: unknown;
  studySessions: unknown[];
  onDataLoaded: (data: {
    leitnerData: Record<string, unknown>;
    progressData: unknown;
    studySessions: unknown[];
  }) => void;
}

export default function SyncModal({
  isOpen,
  onClose,
  leitnerData,
  progressData,
  studySessions,
  onDataLoaded,
}: SyncModalProps) {
  const { currentProfile } = useStudent();
  const { isLoading, error, uploadData, downloadData, clearError } = useSync();

  const [mode, setMode] = useState<'menu' | 'upload' | 'download'>('menu');
  const [generatedPIN, setGeneratedPIN] = useState<string | null>(null);
  const [inputPIN, setInputPIN] = useState('');
  const [copied, setCopied] = useState(false);
  const [success, setSuccess] = useState(false);

  const isButtonDisabled = useRef(false);

  const handleUpload = async () => {
    if (isButtonDisabled.current || !currentProfile) return;
    isButtonDisabled.current = true;

    const result = await uploadData(
      currentProfile.name,
      leitnerData,
      progressData,
      studySessions
    );

    if (result.success && result.pin) {
      setGeneratedPIN(result.pin);
    }

    setTimeout(() => { isButtonDisabled.current = false; }, 400);
  };

  const handleDownload = async () => {
    if (isButtonDisabled.current || inputPIN.length !== 6) return;
    isButtonDisabled.current = true;

    const result = await downloadData(inputPIN);

    if (result.success && result.data) {
      onDataLoaded({
        leitnerData: result.data.leitnerData,
        progressData: result.data.progressData,
        studySessions: result.data.studySessions,
      });
      setSuccess(true);
      setTimeout(() => {
        onClose();
        setSuccess(false);
        setMode('menu');
        setInputPIN('');
      }, 1500);
    }

    setTimeout(() => { isButtonDisabled.current = false; }, 400);
  };

  const handleCopyPIN = async () => {
    if (!generatedPIN) return;
    await navigator.clipboard.writeText(generatedPIN);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClose = () => {
    onClose();
    setMode('menu');
    setGeneratedPIN(null);
    setInputPIN('');
    setSuccess(false);
    clearError();
  };

  const handlePINChange = (value: string) => {
    const numbersOnly = value.replace(/\D/g, '').slice(0, 6);
    setInputPIN(numbersOnly);
    clearError();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50 p-4"
          onClick={handleClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm bg-white dark:bg-slate-800 rounded-3xl shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-between">
              <div className="flex items-center gap-2 text-white">
                <Smartphone className="w-5 h-5" />
                <h2 className="font-bold text-lg">기기 간 동기화</h2>
              </div>
              <button
                onClick={handleClose}
                className="p-1 rounded-full bg-white/20 text-white hover:bg-white/30 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6">
              {/* Menu */}
              {mode === 'menu' && (
                <div className="space-y-4">
                  <p className="text-sm text-slate-600 dark:text-slate-400 text-center mb-6">
                    6자리 PIN 코드로 다른 기기와<br />학습 데이터를 동기화하세요
                  </p>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setMode('upload')}
                    className="w-full p-4 rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-bold flex items-center justify-center gap-3"
                  >
                    <Upload className="w-5 h-5" />
                    이 기기 데이터 내보내기
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setMode('download')}
                    className="w-full p-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold flex items-center justify-center gap-3"
                  >
                    <Download className="w-5 h-5" />
                    다른 기기 데이터 가져오기
                  </motion.button>
                </div>
              )}

              {/* Upload Mode */}
              {mode === 'upload' && (
                <div className="space-y-4">
                  {!generatedPIN ? (
                    <>
                      <p className="text-sm text-slate-600 dark:text-slate-400 text-center">
                        현재 학습 데이터를 업로드하고<br />PIN 코드를 받으세요
                      </p>

                      <div className="bg-slate-100 dark:bg-slate-700 rounded-xl p-4 text-center">
                        <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">프로필</p>
                        <p className="font-bold text-slate-800 dark:text-white">{currentProfile?.name}</p>
                      </div>

                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleUpload}
                        disabled={isLoading}
                        className="w-full p-4 rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-bold flex items-center justify-center gap-2 disabled:opacity-50"
                      >
                        {isLoading ? (
                          <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                          <Upload className="w-5 h-5" />
                        )}
                        {isLoading ? '업로드 중...' : 'PIN 코드 생성'}
                      </motion.button>
                    </>
                  ) : (
                    <>
                      <div className="text-center">
                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                          아래 PIN 코드를 다른 기기에서 입력하세요
                        </p>

                        <div className="bg-gradient-to-r from-indigo-100 to-purple-100 dark:from-indigo-900/50 dark:to-purple-900/50 rounded-2xl p-6 mb-4">
                          <p className="text-4xl font-black tracking-[0.3em] text-indigo-600 dark:text-indigo-400">
                            {generatedPIN}
                          </p>
                        </div>

                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={handleCopyPIN}
                          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-medium"
                        >
                          {copied ? (
                            <>
                              <Check className="w-4 h-4 text-green-500" />
                              복사됨!
                            </>
                          ) : (
                            <>
                              <Copy className="w-4 h-4" />
                              PIN 복사
                            </>
                          )}
                        </motion.button>

                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-4">
                          PIN은 7일간 유효합니다
                        </p>
                      </div>
                    </>
                  )}

                  <button
                    onClick={() => { setMode('menu'); setGeneratedPIN(null); }}
                    className="w-full py-2 text-slate-500 dark:text-slate-400 font-medium"
                  >
                    뒤로
                  </button>
                </div>
              )}

              {/* Download Mode */}
              {mode === 'download' && (
                <div className="space-y-4">
                  {!success ? (
                    <>
                      <p className="text-sm text-slate-600 dark:text-slate-400 text-center">
                        다른 기기에서 받은 PIN 코드를 입력하세요
                      </p>

                      <input
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        value={inputPIN}
                        onChange={(e) => handlePINChange(e.target.value)}
                        placeholder="000000"
                        className="w-full text-center text-3xl font-black tracking-[0.3em] py-4 rounded-2xl border-2 border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-white focus:border-indigo-500 outline-none"
                        maxLength={6}
                      />

                      {error && (
                        <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-sm">
                          <CloudOff className="w-4 h-4 flex-shrink-0" />
                          {error}
                        </div>
                      )}

                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleDownload}
                        disabled={isLoading || inputPIN.length !== 6}
                        className="w-full p-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold flex items-center justify-center gap-2 disabled:opacity-50"
                      >
                        {isLoading ? (
                          <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                          <Download className="w-5 h-5" />
                        )}
                        {isLoading ? '불러오는 중...' : '데이터 가져오기'}
                      </motion.button>

                      <p className="text-xs text-slate-500 dark:text-slate-400 text-center">
                        기존 데이터는 덮어씌워집니다
                      </p>
                    </>
                  ) : (
                    <div className="text-center py-8">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 dark:bg-green-900/50 flex items-center justify-center"
                      >
                        <Check className="w-8 h-8 text-green-500" />
                      </motion.div>
                      <p className="font-bold text-slate-800 dark:text-white">동기화 완료!</p>
                    </div>
                  )}

                  {!success && (
                    <button
                      onClick={() => { setMode('menu'); setInputPIN(''); clearError(); }}
                      className="w-full py-2 text-slate-500 dark:text-slate-400 font-medium"
                    >
                      뒤로
                    </button>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
