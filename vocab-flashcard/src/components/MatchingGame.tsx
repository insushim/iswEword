'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Trophy, RotateCcw } from 'lucide-react';
import { MatchingPair, Word } from '@/types';
import { useSound } from '@/hooks/useSound';
import { shuffleArray, formatTime, getRandomItems } from '@/utils';
import Confetti from './Confetti';

interface MatchingGameProps {
  words: Word[];
  pairCount?: number;
  onComplete?: (time: number, moves: number) => void;
}

interface CardItem {
  id: string;
  pairId: number;
  text: string;
  type: 'english' | 'korean';
  matched: boolean;
}

export default function MatchingGame({ words, pairCount = 6, onComplete }: MatchingGameProps) {
  const [cards, setCards] = useState<CardItem[]>([]);
  const [selectedCards, setSelectedCards] = useState<string[]>([]);
  const [matchedPairs, setMatchedPairs] = useState<Set<number>>(new Set());
  const [moves, setMoves] = useState(0);
  const [time, setTime] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const { playSound } = useSound();
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const initGame = useCallback(() => {
    const selectedWords = getRandomItems(words, pairCount);
    const cardItems: CardItem[] = [];

    selectedWords.forEach((word) => {
      cardItems.push({
        id: `en-${word.id}`,
        pairId: word.id,
        text: word.english,
        type: 'english',
        matched: false,
      });
      cardItems.push({
        id: `ko-${word.id}`,
        pairId: word.id,
        text: word.korean,
        type: 'korean',
        matched: false,
      });
    });

    setCards(shuffleArray(cardItems));
    setSelectedCards([]);
    setMatchedPairs(new Set());
    setMoves(0);
    setTime(0);
    setIsComplete(false);
    setIsPlaying(false);
    setShowConfetti(false);
  }, [words, pairCount]);

  useEffect(() => {
    initGame();
  }, [initGame]);

  useEffect(() => {
    if (isPlaying && !isComplete) {
      timerRef.current = setInterval(() => {
        setTime((prev) => prev + 1);
      }, 1000);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isPlaying, isComplete]);

  const handleCardClick = (cardId: string) => {
    if (!isPlaying) {
      setIsPlaying(true);
    }

    const card = cards.find((c) => c.id === cardId);
    if (!card || card.matched || selectedCards.includes(cardId)) return;

    playSound('click');

    const newSelected = [...selectedCards, cardId];
    setSelectedCards(newSelected);

    if (newSelected.length === 2) {
      setMoves((prev) => prev + 1);

      const [first, second] = newSelected;
      const firstCard = cards.find((c) => c.id === first);
      const secondCard = cards.find((c) => c.id === second);

      if (firstCard && secondCard && firstCard.pairId === secondCard.pairId && firstCard.type !== secondCard.type) {
        // Match!
        playSound('correct');
        setMatchedPairs((prev) => new Set(prev).add(firstCard.pairId));
        setCards((prev) =>
          prev.map((c) => (c.pairId === firstCard.pairId ? { ...c, matched: true } : c))
        );
        setSelectedCards([]);

        // Check if game is complete
        if (matchedPairs.size + 1 === pairCount) {
          setIsComplete(true);
          setIsPlaying(false);
          setShowConfetti(true);
          playSound('complete');
          onComplete?.(time, moves + 1);
        }
      } else {
        // No match
        playSound('wrong');
        setTimeout(() => {
          setSelectedCards([]);
        }, 800);
      }
    }
  };

  const getCardStyle = (card: CardItem) => {
    if (card.matched) {
      return 'bg-green-100 dark:bg-green-900/50 border-green-500 text-green-800 dark:text-green-200 scale-95 opacity-70';
    }
    if (selectedCards.includes(card.id)) {
      return card.type === 'english'
        ? 'bg-indigo-100 dark:bg-indigo-900/50 border-indigo-500 text-indigo-800 dark:text-indigo-200 scale-105'
        : 'bg-purple-100 dark:bg-purple-900/50 border-purple-500 text-purple-800 dark:text-purple-200 scale-105';
    }
    return 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-600';
  };

  if (words.length < pairCount) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-500 dark:text-slate-400">단어가 부족합니다.</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto px-4">
      <Confetti active={showConfetti} />

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 rounded-xl px-4 py-2">
            <Clock className="w-5 h-5 text-slate-500" />
            <span className="font-mono text-lg font-bold text-slate-700 dark:text-slate-200">{formatTime(time)}</span>
          </div>
          <div className="text-slate-600 dark:text-slate-300">
            이동: <span className="font-bold">{moves}</span>
          </div>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={initGame}
          className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
          새 게임
        </motion.button>
      </div>

      {/* Progress */}
      <div className="mb-6">
        <div className="flex justify-between text-sm text-slate-500 dark:text-slate-400 mb-2">
          <span>매칭 진행률</span>
          <span>{matchedPairs.size} / {pairCount}</span>
        </div>
        <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-green-400 to-emerald-500 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${(matchedPairs.size / pairCount) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* Complete Modal */}
      <AnimatePresence>
        {isComplete && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          >
            <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl">
              <Trophy className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-4">완료!</h2>
              <div className="space-y-2 mb-6">
                <p className="text-slate-600 dark:text-slate-300">
                  시간: <span className="font-bold">{formatTime(time)}</span>
                </p>
                <p className="text-slate-600 dark:text-slate-300">
                  이동 횟수: <span className="font-bold">{moves}</span>
                </p>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={initGame}
                className="w-full py-3 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl font-medium transition-colors"
              >
                다시 하기
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Game Grid */}
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
        {cards.map((card) => (
          <motion.button
            key={card.id}
            whileHover={!card.matched ? { scale: 1.02 } : undefined}
            whileTap={!card.matched ? { scale: 0.98 } : undefined}
            onClick={() => handleCardClick(card.id)}
            disabled={card.matched || selectedCards.length >= 2}
            className={`p-3 sm:p-4 rounded-xl border-2 font-medium transition-all min-h-[60px] sm:min-h-[80px] flex items-center justify-center text-center ${getCardStyle(card)}`}
          >
            <span className={`text-sm sm:text-base ${card.type === 'english' ? 'font-bold' : ''}`}>
              {card.text}
            </span>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
