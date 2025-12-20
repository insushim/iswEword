'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, RotateCcw, Trophy, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
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

  // 버튼 클릭 방지용 - useRef 사용
  const isButtonDisabled = useRef(false);

  // 마지막으로 읽은 단어 추적
  const lastSpokenWord = useRef<string>('');

  const { playSound } = useSound();
  const { markCorrect, markWrong, getWordData } = useLeitner();
  const { recordCorrect, recordWrong, checkAchievements } = useProgress();

  // 단어 읽기 함수 (직접 speechSynthesis 사용)
  const speakWord = (text: string) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    if (lastSpokenWord.current === text) return; // 같은 단어 중복 방지

    lastSpokenWord.current = text;
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
  };

  // 초기화
  useEffect(() => {
    const shuffled = shuffleArray(words);
    setDeck(shuffled);
    setCurrentIndex(0);
    setIsFlipped(false);
    setCorrectCount(0);
    setWrongCount(0);
    setCompletedIds(new Set());
    setIsComplete(false);
    isButtonDisabled.current = false;
    lastSpokenWord.current = '';

    // 첫 단어 읽기
    if (shuffled.length > 0) {
      setTimeout(() => speakWord(shuffled[0].english), 500);
    }
  }, [words]);

  const currentWord = deck[currentIndex];

  // 현재 단어가 바뀔 때 읽기
  useEffect(() => {
    if (currentWord && currentWord.english) {
      const timer = setTimeout(() => {
        speakWord(currentWord.english);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [currentIndex]); // currentIndex가 바뀔 때만 실행

  // 알아요 버튼
  const onClickCorrect = () => {
    if (!currentWord || isButtonDisabled.current) return;

    isButtonDisabled.current = true;

    playSound('correct');
    markCorrect(currentWord.id);
    recordCorrect();

    const newCorrectCount = correctCount + 1;
    const newCompletedIds = new Set(completedIds);
    newCompletedIds.add(currentWord.id);

    setCorrectCount(newCorrectCount);
    setCompletedIds(newCompletedIds);
    setIsFlipped(false);

    // 남은 카드 확인
    const remainingCards = deck.filter(w => !newCompletedIds.has(w.id));

    if (remainingCards.length === 0) {
      // 학습 완료
      setIsComplete(true);
      setShowConfetti(true);
      playSound('complete');
      checkAchievements();
      onComplete?.({ correct: newCorrectCount, wrong: wrongCount });
      isButtonDisabled.current = false;
      return;
    }

    // 다음 카드 찾기
    let nextIndex = -1;

    // 현재 위치 다음부터 찾기
    for (let i = currentIndex + 1; i < deck.length; i++) {
      if (!newCompletedIds.has(deck[i].id)) {
        nextIndex = i;
        break;
      }
    }

    // 못 찾으면 처음부터 찾기
    if (nextIndex === -1) {
      for (let i = 0; i < deck.length; i++) {
        if (!newCompletedIds.has(deck[i].id)) {
          nextIndex = i;
          break;
        }
      }
    }

    // 다음 카드로 이동
    if (nextIndex !== -1) {
      lastSpokenWord.current = ''; // 리셋해서 새 단어 읽을 수 있게
      setCurrentIndex(nextIndex);
    }

    // 버튼 다시 활성화
    setTimeout(() => {
      isButtonDisabled.current = false;
    }, 400);
  };

  // 모르겠어요 버튼
  const onClickWrong = () => {
    if (!currentWord || isButtonDisabled.current) return;

    isButtonDisabled.current = true;

    playSound('wrong');
    markWrong(currentWord.id);
    recordWrong();
    setWrongCount(prev => prev + 1);
    setIsFlipped(false);

    // 카드를 맨 뒤로 이동
    const newDeck = [...deck];
    const [movedCard] = newDeck.splice(currentIndex, 1);
    newDeck.push(movedCard);
    setDeck(newDeck);

    // 현재 위치에 새 카드가 오므로 인덱스 유지
    // 단, 범위를 벗어나면 0으로
    if (currentIndex >= newDeck.length) {
      setCurrentIndex(0);
    }

    lastSpokenWord.current = ''; // 리셋

    setTimeout(() => {
      isButtonDisabled.current = false;
    }, 400);
  };

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
    lastSpokenWord.current = '';
  };

  const handlePrevCard = () => {
    if (currentIndex > 0) {
      setIsFlipped(false);
      lastSpokenWord.current = '';
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleNextCard = () => {
    if (currentIndex < deck.length - 1) {
      setIsFlipped(false);
      lastSpokenWord.current = '';
      setCurrentIndex(currentIndex + 1);
    }
  };

  const totalCards = words.length;
  const progress = (completedIds.size / totalCards) * 100;
  const remaining = totalCards - completedIds.size;

  if (words.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200 }}
          className="w-24 h-24 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 flex items-center justify-center mb-6"
        >
          <span className="text-5xl">📚</span>
        </motion.div>
        <h2 className="text-2xl font-black text-slate-800 dark:text-white mb-2">학습할 단어가 없어요</h2>
        <p className="text-slate-500 dark:text-slate-400 text-center max-w-xs">
          {mode === 'review' ? '오늘 복습할 단어가 없습니다! 대단해요!' : '레벨을 선택해서 학습을 시작하세요.'}
        </p>
      </div>
    );
  }

  if (isComplete) {
    const accuracy = Math.round((correctCount / (correctCount + wrongCount)) * 100) || 0;

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
          className="w-24 h-24 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center mb-6 shadow-lg shadow-amber-500/30"
        >
          <Trophy className="w-12 h-12 text-white" />
        </motion.div>

        <h2 className="text-3xl font-black text-slate-800 dark:text-white mb-2">학습 완료!</h2>
        <p className="text-slate-500 dark:text-slate-400 mb-6">정말 잘했어요!</p>

        <div className="grid grid-cols-2 gap-4 mb-6 w-full max-w-xs">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 rounded-2xl p-4 text-center shadow-lg"
          >
            <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center mx-auto mb-2">
              <CheckCircle className="w-5 h-5 text-white" />
            </div>
            <div className="text-3xl font-black text-green-600 dark:text-green-400">{correctCount}</div>
            <div className="text-sm text-green-700 dark:text-green-300 font-medium">맞았어요</div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-gradient-to-br from-red-100 to-rose-100 dark:from-red-900/30 dark:to-rose-900/30 rounded-2xl p-4 text-center shadow-lg"
          >
            <div className="w-10 h-10 rounded-full bg-red-500 flex items-center justify-center mx-auto mb-2">
              <XCircle className="w-5 h-5 text-white" />
            </div>
            <div className="text-3xl font-black text-red-600 dark:text-red-400">{wrongCount}</div>
            <div className="text-sm text-red-700 dark:text-red-300 font-medium">다시 볼게요</div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-lg mb-6 w-full max-w-xs"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="font-bold text-slate-700 dark:text-slate-200">정확도</span>
            <span className={`text-2xl font-black ${accuracy >= 80 ? 'text-green-500' : accuracy >= 50 ? 'text-amber-500' : 'text-red-500'}`}>
              {accuracy}%
            </span>
          </div>
          <div className="h-3 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${accuracy}%` }}
              transition={{ duration: 1, delay: 0.6 }}
              className={`h-full rounded-full ${accuracy >= 80 ? 'bg-gradient-to-r from-green-500 to-emerald-400' : accuracy >= 50 ? 'bg-gradient-to-r from-amber-500 to-orange-400' : 'bg-gradient-to-r from-red-500 to-rose-400'}`}
            />
          </div>
        </motion.div>

        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleRestart}
          className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-2xl font-bold text-lg shadow-lg shadow-indigo-500/30 hover:shadow-xl transition-all"
        >
          <RotateCcw className="w-5 h-5" />
          다시 학습하기
        </motion.button>
      </motion.div>
    );
  }

  return (
    <div className="flex flex-col items-center px-4 py-4">
      {/* Progress Section */}
      <div className="w-full max-w-sm mb-6">
        <div className="flex justify-between text-sm font-medium text-slate-600 dark:text-slate-300 mb-2">
          <span>진행률</span>
          <span className="flex items-center gap-1">
            <Sparkles className="w-4 h-4 text-indigo-500" />
            {completedIds.size} / {totalCards}
          </span>
        </div>
        <ProgressBar progress={progress} />
        <div className="flex justify-between text-xs text-slate-500 mt-2">
          <span className="flex items-center gap-1">
            <CheckCircle className="w-3 h-3 text-green-500" />
            맞음: {correctCount}
          </span>
          <span className="flex items-center gap-1">
            <XCircle className="w-3 h-3 text-red-500" />
            틀림: {wrongCount}
          </span>
          <span>남음: {remaining}</span>
        </div>
      </div>

      {/* Progress dots */}
      <div className="flex items-center justify-center gap-1.5 mb-4 flex-wrap max-w-sm">
        {deck.slice(0, 20).map((w, idx) => (
          <div
            key={w.id}
            className={`h-2 rounded-full transition-all duration-300 ${
              idx === currentIndex
                ? 'w-6 bg-indigo-500'
                : completedIds.has(w.id)
                ? 'w-2 bg-green-400'
                : 'w-2 bg-slate-200 dark:bg-slate-700'
            }`}
          />
        ))}
        {deck.length > 20 && (
          <span className="text-xs text-slate-400 ml-1">+{deck.length - 20}</span>
        )}
      </div>

      {/* Card with Navigation */}
      <div className="relative w-full max-w-sm">
        {/* Navigation Arrows */}
        <button
          onClick={handlePrevCard}
          disabled={currentIndex === 0}
          className={`absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 p-2 rounded-full bg-white dark:bg-slate-700 shadow-lg transition-all ${
            currentIndex === 0 ? 'opacity-30 cursor-not-allowed' : 'hover:scale-110'
          }`}
        >
          <ChevronLeft className="w-6 h-6 text-slate-600 dark:text-slate-300" />
        </button>
        <button
          onClick={handleNextCard}
          disabled={currentIndex === deck.length - 1}
          className={`absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 p-2 rounded-full bg-white dark:bg-slate-700 shadow-lg transition-all ${
            currentIndex === deck.length - 1 ? 'opacity-30 cursor-not-allowed' : 'hover:scale-110'
          }`}
        >
          <ChevronRight className="w-6 h-6 text-slate-600 dark:text-slate-300" />
        </button>

        {/* Card - key 제거하여 리마운트 방지 */}
        {currentWord && (
          <div className="w-full">
            <FlashCard
              word={currentWord}
              isFlipped={isFlipped}
              onFlip={() => setIsFlipped(!isFlipped)}
              boxLevel={getWordData(currentWord.id)?.box}
              showBox={mode === 'review'}
            />
          </div>
        )}
      </div>

      {/* Action buttons - 일반 button 사용 */}
      <div className="flex gap-4 mt-8">
        <button
          onClick={onClickWrong}
          className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-lg shadow-lg hover:shadow-xl transition-all active:scale-95"
        >
          <XCircle className="w-6 h-6 text-orange-500" />
          모르겠어요
        </button>

        <button
          onClick={onClickCorrect}
          className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-green-500 to-emerald-400 text-white font-bold text-lg shadow-lg shadow-green-500/30 hover:shadow-xl transition-all active:scale-95"
        >
          <CheckCircle className="w-6 h-6" />
          알아요!
        </button>
      </div>
    </div>
  );
}
