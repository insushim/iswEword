'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, RotateCcw, Trophy } from 'lucide-react';
import { Word } from '@/types';
import FlashCard from './FlashCard';
import ProgressBar from './ProgressBar';
import Confetti from './Confetti';
import { useSound } from '@/hooks/useSound';
import { useLeitner } from '@/hooks/useLeitner';
import { useProgress } from '@/hooks/useProgress';
import { shuffleArray } from '@/utils';

interface CardDeckProps {
  words: Word[];
  mode: 'study' | 'review' | 'wrong';
  onComplete?: (stats: { correct: number; wrong: number }) => void;
}

export default function CardDeck({ words, mode, onComplete }: CardDeckProps) {
  const [deck, setDeck] = useState<Word[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [completedIds, setCompletedIds] = useState<Set<number>>(new Set());
  const [isComplete, setIsComplete] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const { playSound } = useSound();
  const { markCorrect, markWrong, getWordData } = useLeitner();
  const { recordCorrect, recordWrong, checkAchievements } = useProgress();

  useEffect(() => {
    const shuffled = shuffleArray(words);
    setDeck(shuffled);
    setCurrentIndex(0);
    setIsFlipped(false);
    setCorrectCount(0);
    setWrongCount(0);
    setCompletedIds(new Set());
    setIsComplete(false);
  }, [words]);

  const currentWord = deck[currentIndex];

  const moveToNext = useCallback(() => {
    setIsFlipped(false);

    const remainingCards = deck.filter((w) => !completedIds.has(w.id));

    if (remainingCards.length === 0) {
      setIsComplete(true);
      setShowConfetti(true);
      playSound('complete');
      checkAchievements();
      onComplete?.({ correct: correctCount, wrong: wrongCount });
      return;
    }

    setTimeout(() => {
      const nextIndex = deck.findIndex((w, i) => i > currentIndex && !completedIds.has(w.id));
      if (nextIndex !== -1) {
        setCurrentIndex(nextIndex);
      } else {
        const firstIndex = deck.findIndex((w) => !completedIds.has(w.id));
        if (firstIndex !== -1) {
          setCurrentIndex(firstIndex);
        }
      }
    }, 200);
  }, [deck, currentIndex, completedIds, correctCount, wrongCount, playSound, checkAchievements, onComplete]);

  const handleCorrect = useCallback(() => {
    if (!currentWord) return;

    playSound('correct');
    markCorrect(currentWord.id);
    recordCorrect();
    setCorrectCount((prev) => prev + 1);
    setCompletedIds((prev) => new Set(prev).add(currentWord.id));
    moveToNext();
  }, [currentWord, playSound, markCorrect, recordCorrect, moveToNext]);

  const handleWrong = useCallback(() => {
    if (!currentWord) return;

    playSound('wrong');
    markWrong(currentWord.id);
    recordWrong();
    setWrongCount((prev) => prev + 1);

    // Move to back of deck
    setIsFlipped(false);
    setTimeout(() => {
      const newDeck = [...deck];
      const [movedCard] = newDeck.splice(currentIndex, 1);
      newDeck.push(movedCard);
      setDeck(newDeck);

      if (currentIndex >= newDeck.length) {
        setCurrentIndex(0);
      }
    }, 200);
  }, [currentWord, deck, currentIndex, playSound, markWrong, recordWrong]);

  const handleRestart = () => {
    const shuffled = shuffleArray(words);
    setDeck(shuffled);
    setCurrentIndex(0);
    setIsFlipped(false);
    setCorrectCount(0);
    setWrongCount(0);
    setCompletedIds(new Set());
    setIsComplete(false);
    setShowConfetti(false);
  };

  const totalCards = words.length;
  const progress = (completedIds.size / totalCards) * 100;
  const remaining = totalCards - completedIds.size;

  if (words.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4">
        <div className="text-6xl mb-4">📚</div>
        <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-2">학습할 단어가 없어요</h2>
        <p className="text-slate-500 dark:text-slate-400 text-center">
          {mode === 'review' ? '오늘 복습할 단어가 없습니다!' : '레벨을 선택해서 학습을 시작하세요.'}
        </p>
      </div>
    );
  }

  if (isComplete) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center py-12 px-4"
      >
        <Confetti active={showConfetti} />

        <motion.div
          animate={{ rotate: [0, -10, 10, -10, 0] }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-7xl mb-6"
        >
          <Trophy className="w-20 h-20 text-yellow-500" />
        </motion.div>

        <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-4">학습 완료!</h2>

        <div className="grid grid-cols-2 gap-4 mb-6 w-full max-w-xs">
          <div className="bg-green-100 dark:bg-green-900/30 rounded-2xl p-4 text-center">
            <div className="text-3xl font-bold text-green-600 dark:text-green-400">{correctCount}</div>
            <div className="text-sm text-green-700 dark:text-green-300">맞았어요</div>
          </div>
          <div className="bg-red-100 dark:bg-red-900/30 rounded-2xl p-4 text-center">
            <div className="text-3xl font-bold text-red-600 dark:text-red-400">{wrongCount}</div>
            <div className="text-sm text-red-700 dark:text-red-300">틀렸어요</div>
          </div>
        </div>

        <div className="text-lg text-slate-600 dark:text-slate-300 mb-6">
          정확도: {Math.round((correctCount / (correctCount + wrongCount)) * 100) || 0}%
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleRestart}
          className="flex items-center gap-2 px-6 py-3 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl font-medium transition-colors"
        >
          <RotateCcw className="w-5 h-5" />
          다시 학습하기
        </motion.button>
      </motion.div>
    );
  }

  return (
    <div className="flex flex-col items-center px-4 py-4">
      {/* Progress */}
      <div className="w-full max-w-sm mb-6">
        <div className="flex justify-between text-sm text-slate-600 dark:text-slate-300 mb-2">
          <span>진행률</span>
          <span>{completedIds.size} / {totalCards}</span>
        </div>
        <ProgressBar progress={progress} />
        <div className="flex justify-between text-xs text-slate-500 mt-2">
          <span className="text-green-500">맞음: {correctCount}</span>
          <span className="text-red-500">틀림: {wrongCount}</span>
          <span>남음: {remaining}</span>
        </div>
      </div>

      {/* Card */}
      <AnimatePresence mode="wait">
        {currentWord && (
          <motion.div
            key={currentWord.id}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.3 }}
            className="w-full"
          >
            <FlashCard
              word={currentWord}
              isFlipped={isFlipped}
              onFlip={() => setIsFlipped(!isFlipped)}
              boxLevel={getWordData(currentWord.id)?.box}
              showBox={mode === 'review'}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Action buttons */}
      <div className="flex gap-6 mt-8">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleWrong}
          className="flex flex-col items-center gap-1 p-4 rounded-2xl bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
        >
          <XCircle className="w-10 h-10" />
          <span className="text-sm font-medium">다시 볼래요</span>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleCorrect}
          className="flex flex-col items-center gap-1 p-4 rounded-2xl bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors"
        >
          <CheckCircle className="w-10 h-10" />
          <span className="text-sm font-medium">알겠어요</span>
        </motion.button>
      </div>
    </div>
  );
}
