'use client';

import { useState, useMemo, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Trophy, RotateCcw, Play } from 'lucide-react';
import Link from 'next/link';
import { words } from '@/data/words';
import { SpellingInput, LevelSelector, ProgressBar, Confetti } from '@/components';
import { useProgress } from '@/hooks/useProgress';
import { useLeitner } from '@/hooks/useLeitner';
import { useSound } from '@/hooks/useSound';
import { shuffleArray, getWordsByLevel } from '@/utils';
import { Word } from '@/types';

export default function SpellingPage() {
  const [selectedLevel, setSelectedLevel] = useState(1);
  const [wordCount, setWordCount] = useState(10);
  const [isStarted, setIsStarted] = useState(false);
  const [spellingWords, setSpellingWords] = useState<Word[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [consecutiveCorrect, setConsecutiveCorrect] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const { progress, recordCorrect, recordWrong, unlockAchievement } = useProgress();
  const { markCorrect, markWrong } = useLeitner();
  const { playSound } = useSound();
  const isButtonDisabled = useRef(false);

  const levelWords = useMemo(() => getWordsByLevel(words, selectedLevel), [selectedLevel]);

  const startSpelling = useCallback(() => {
    if (isButtonDisabled.current) return;
    isButtonDisabled.current = true;
    setTimeout(() => { isButtonDisabled.current = false; }, 400);
    const shuffled = shuffleArray(levelWords).slice(0, wordCount);
    setSpellingWords(shuffled);
    setCurrentIndex(0);
    setCorrectCount(0);
    setWrongCount(0);
    setConsecutiveCorrect(0);
    setIsComplete(false);
    setShowConfetti(false);
    setIsStarted(true);
  }, [levelWords, wordCount]);

  const handleAnswer = useCallback((correct: boolean) => {
    const currentWord = spellingWords[currentIndex];

    if (correct) {
      setCorrectCount((prev) => prev + 1);
      setConsecutiveCorrect((prev) => {
        const newCount = prev + 1;
        if (newCount >= 10) {
          unlockAchievement('spelling_master');
        }
        return newCount;
      });
      markCorrect(currentWord.id);
      recordCorrect();
    } else {
      setWrongCount((prev) => prev + 1);
      setConsecutiveCorrect(0);
      markWrong(currentWord.id);
      recordWrong();
    }

    if (currentIndex + 1 >= spellingWords.length) {
      setIsComplete(true);
      if (correctCount + (correct ? 1 : 0) === spellingWords.length) {
        setShowConfetti(true);
        playSound('complete');
      }
    } else {
      setTimeout(() => {
        setCurrentIndex((prev) => prev + 1);
      }, 1000);
    }
  }, [spellingWords, currentIndex, correctCount, markCorrect, markWrong, recordCorrect, recordWrong, unlockAchievement, playSound]);

  const restartSpelling = () => {
    if (isButtonDisabled.current) return;
    isButtonDisabled.current = true;
    setTimeout(() => { isButtonDisabled.current = false; }, 400);
    setIsStarted(false);
    setIsComplete(false);
  };

  const currentWord = spellingWords[currentIndex];
  const progressPercentage = ((currentIndex) / spellingWords.length) * 100;

  return (
    <div className="min-h-screen">
      <Confetti active={showConfetti} />

      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-700/50">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="p-2 -ml-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
            <ArrowLeft className="w-5 h-5 text-slate-600 dark:text-slate-300" />
          </Link>
          <h1 className="text-lg font-bold text-slate-800 dark:text-white">받아쓰기</h1>
          <div className="w-9" />
        </div>
      </header>

      <div className="max-w-lg mx-auto px-4 py-6">
        {!isStarted ? (
          // Spelling Setup
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {/* Level Selector */}
            <div className="mb-6">
              <LevelSelector
                selectedLevel={selectedLevel}
                onSelectLevel={setSelectedLevel}
                unlockedLevels={progress.unlockedLevels}
              />
            </div>

            {/* Word Count */}
            <div className="mb-8">
              <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-3">단어 수</h3>
              <div className="flex gap-2 flex-wrap">
                {[5, 10, 20, 30].map((count) => (
                  <motion.button
                    key={count}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setWordCount(count)}
                    className={`px-4 py-2 rounded-xl font-medium transition-all ${
                      wordCount === count
                        ? 'bg-purple-500 text-white'
                        : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    {count}개
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Instructions */}
            <div className="bg-purple-50 dark:bg-purple-900/30 rounded-2xl p-4 mb-6">
              <h4 className="font-bold text-purple-800 dark:text-purple-200 mb-2">받아쓰기 방법</h4>
              <ul className="text-sm text-purple-700 dark:text-purple-300 space-y-1">
                <li>1. 한글 뜻을 보고 영어 단어를 입력하세요</li>
                <li>2. 발음 듣기 버튼으로 발음을 확인할 수 있어요</li>
                <li>3. 10개 연속 정답 시 업적을 획득해요!</li>
              </ul>
            </div>

            {/* Start Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={startSpelling}
              className="w-full flex items-center justify-center gap-2 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl transition-all"
            >
              <Play className="w-6 h-6" />
              시작하기
            </motion.button>
          </motion.div>
        ) : isComplete ? (
          // Spelling Complete
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-8"
          >
            <Trophy className="w-20 h-20 text-yellow-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-4">받아쓰기 완료!</h2>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-green-100 dark:bg-green-900/30 rounded-2xl p-4">
                <div className="text-3xl font-bold text-green-600 dark:text-green-400">{correctCount}</div>
                <div className="text-sm text-green-700 dark:text-green-300">정답</div>
              </div>
              <div className="bg-red-100 dark:bg-red-900/30 rounded-2xl p-4">
                <div className="text-3xl font-bold text-red-600 dark:text-red-400">{wrongCount}</div>
                <div className="text-sm text-red-700 dark:text-red-300">오답</div>
              </div>
            </div>

            <div className="text-lg text-slate-600 dark:text-slate-300 mb-6">
              정확도: {Math.round((correctCount / spellingWords.length) * 100)}%
            </div>

            <div className="flex gap-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={restartSpelling}
                className="flex-1 flex items-center justify-center gap-2 py-3 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-xl font-medium"
              >
                <RotateCcw className="w-5 h-5" />
                다시 설정
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={startSpelling}
                className="flex-1 flex items-center justify-center gap-2 py-3 bg-purple-500 text-white rounded-xl font-medium"
              >
                <Play className="w-5 h-5" />
                다시 시작
              </motion.button>
            </div>
          </motion.div>
        ) : (
          // Spelling In Progress
          <>
            {/* Progress */}
            <div className="mb-6">
              <ProgressBar progress={progressPercentage} color="rainbow" />
              {consecutiveCorrect >= 3 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center mt-2"
                >
                  <span className="text-orange-500 font-bold">
                    🔥 {consecutiveCorrect}연속 정답!
                  </span>
                </motion.div>
              )}
            </div>

            {/* Spelling Input */}
            <AnimatePresence mode="wait">
              {currentWord && (
                <motion.div
                  key={currentIndex}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                >
                  <SpellingInput
                    word={currentWord}
                    onAnswer={handleAnswer}
                    questionNumber={currentIndex + 1}
                    totalQuestions={spellingWords.length}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </>
        )}
      </div>
    </div>
  );
}
