'use client';

import { useState, useMemo, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Trophy, RotateCcw, Play } from 'lucide-react';
import Link from 'next/link';
import { words } from '@/data/words';
import { QuizCard, LevelSelector, ProgressBar, Confetti } from '@/components';
import { useProgress } from '@/hooks/useProgress';
import { useLeitner } from '@/hooks/useLeitner';
import { useSound } from '@/hooks/useSound';
import { generateQuizQuestions, getWordsByLevel } from '@/utils';
import { QuizQuestion } from '@/types';

export default function QuizPage() {
  const [selectedLevel, setSelectedLevel] = useState(1);
  const [questionCount, setQuestionCount] = useState(10);
  const [isStarted, setIsStarted] = useState(false);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const { progress, recordCorrect, recordWrong, unlockAchievement } = useProgress();
  const { markCorrect, markWrong } = useLeitner();
  const { playSound } = useSound();
  const isButtonDisabled = useRef(false);

  const levelWords = useMemo(() => getWordsByLevel(words, selectedLevel), [selectedLevel]);

  const startQuiz = useCallback(() => {
    if (isButtonDisabled.current) return;
    isButtonDisabled.current = true;
    setTimeout(() => { isButtonDisabled.current = false; }, 400);
    const newQuestions = generateQuizQuestions(levelWords, questionCount);
    setQuestions(newQuestions);
    setCurrentIndex(0);
    setCorrectCount(0);
    setWrongCount(0);
    setIsComplete(false);
    setShowConfetti(false);
    setIsStarted(true);
  }, [levelWords, questionCount]);

  const handleAnswer = useCallback((correct: boolean) => {
    const currentQuestion = questions[currentIndex];

    if (correct) {
      setCorrectCount((prev) => prev + 1);
      markCorrect(currentQuestion.word.id);
      recordCorrect();
    } else {
      setWrongCount((prev) => prev + 1);
      markWrong(currentQuestion.word.id);
      recordWrong();
    }

    if (currentIndex + 1 >= questions.length) {
      setIsComplete(true);
      if (correctCount + (correct ? 1 : 0) === questions.length) {
        unlockAchievement('quiz_perfect');
        setShowConfetti(true);
        playSound('complete');
      }
    } else {
      setTimeout(() => {
        setCurrentIndex((prev) => prev + 1);
      }, 500);
    }
  }, [questions, currentIndex, correctCount, markCorrect, markWrong, recordCorrect, recordWrong, unlockAchievement, playSound]);

  const restartQuiz = () => {
    if (isButtonDisabled.current) return;
    isButtonDisabled.current = true;
    setTimeout(() => { isButtonDisabled.current = false; }, 400);
    setIsStarted(false);
    setIsComplete(false);
  };

  const currentQuestion = questions[currentIndex];
  const progressPercentage = ((currentIndex) / questions.length) * 100;

  return (
    <div className="min-h-screen">
      <Confetti active={showConfetti} />

      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-700/50">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="p-2 -ml-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
            <ArrowLeft className="w-5 h-5 text-slate-600 dark:text-slate-300" />
          </Link>
          <h1 className="text-lg font-bold text-slate-800 dark:text-white">4지선다 퀴즈</h1>
          <div className="w-9" />
        </div>
      </header>

      <div className="max-w-lg mx-auto px-4 py-6">
        {!isStarted ? (
          // Quiz Setup
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

            {/* Question Count */}
            <div className="mb-8">
              <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-3">문제 수</h3>
              <div className="flex gap-2 flex-wrap">
                {[5, 10, 20, 30].map((count) => (
                  <motion.button
                    key={count}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setQuestionCount(count)}
                    className={`px-4 py-2 rounded-xl font-medium transition-all ${
                      questionCount === count
                        ? 'bg-indigo-500 text-white'
                        : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    {count}문제
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Start Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={startQuiz}
              disabled={levelWords.length < 4}
              className="w-full flex items-center justify-center gap-2 py-4 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
            >
              <Play className="w-6 h-6" />
              퀴즈 시작
            </motion.button>

            {levelWords.length < 4 && (
              <p className="text-center text-red-500 mt-2 text-sm">
                퀴즈를 시작하려면 최소 4개의 단어가 필요합니다.
              </p>
            )}
          </motion.div>
        ) : isComplete ? (
          // Quiz Complete
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-8"
          >
            <Trophy className="w-20 h-20 text-yellow-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-4">퀴즈 완료!</h2>

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
              정확도: {Math.round((correctCount / questions.length) * 100)}%
            </div>

            {correctCount === questions.length && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-r from-yellow-100 to-orange-100 dark:from-yellow-900/30 dark:to-orange-900/30 rounded-2xl p-4 mb-6"
              >
                <span className="text-2xl">🎯</span>
                <p className="text-yellow-800 dark:text-yellow-200 font-medium">만점을 받았어요!</p>
              </motion.div>
            )}

            <div className="flex gap-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={restartQuiz}
                className="flex-1 flex items-center justify-center gap-2 py-3 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-xl font-medium"
              >
                <RotateCcw className="w-5 h-5" />
                다시 설정
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={startQuiz}
                className="flex-1 flex items-center justify-center gap-2 py-3 bg-indigo-500 text-white rounded-xl font-medium"
              >
                <Play className="w-5 h-5" />
                다시 시작
              </motion.button>
            </div>
          </motion.div>
        ) : (
          // Quiz In Progress
          <>
            {/* Progress */}
            <div className="mb-6">
              <ProgressBar progress={progressPercentage} />
            </div>

            {/* Question */}
            <AnimatePresence mode="wait">
              {currentQuestion && (
                <motion.div
                  key={currentIndex}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                >
                  <QuizCard
                    question={currentQuestion}
                    onAnswer={handleAnswer}
                    questionNumber={currentIndex + 1}
                    totalQuestions={questions.length}
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
