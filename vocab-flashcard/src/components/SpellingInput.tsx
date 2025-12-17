'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Volume2, Check, X, ArrowRight, RefreshCw } from 'lucide-react';
import { Word } from '@/types';
import { useTTS } from '@/hooks/useTTS';
import { useSound } from '@/hooks/useSound';

interface SpellingInputProps {
  word: Word;
  onAnswer: (correct: boolean) => void;
  questionNumber: number;
  totalQuestions: number;
}

export default function SpellingInput({ word, onAnswer, questionNumber, totalQuestions }: SpellingInputProps) {
  const [input, setInput] = useState('');
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { speak } = useTTS();
  const { playSound } = useSound();

  useEffect(() => {
    speak(word.english);
    inputRef.current?.focus();
  }, [word.english, speak]);

  useEffect(() => {
    setInput('');
    setIsAnswered(false);
    setIsCorrect(false);
    inputRef.current?.focus();
  }, [word.id]);

  const checkAnswer = useCallback(() => {
    if (isAnswered || !input.trim()) return;

    const correct = input.trim().toLowerCase() === word.english.toLowerCase();
    setIsCorrect(correct);
    setIsAnswered(true);

    if (correct) {
      playSound('correct');
    } else {
      playSound('wrong');
    }

    setTimeout(() => {
      onAnswer(correct);
    }, 1500);
  }, [input, word.english, isAnswered, playSound, onAnswer]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      checkAnswer();
    }
  };

  const handlePlaySound = () => {
    speak(word.english);
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Progress */}
      <div className="text-center mb-6">
        <span className="text-sm text-slate-500 dark:text-slate-400">
          문제 {questionNumber} / {totalQuestions}
        </span>
      </div>

      {/* Word Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-3xl p-6 shadow-xl mb-6"
      >
        <div className="flex items-center justify-center gap-3 mb-4">
          <span className="text-5xl">{word.emoji}</span>
        </div>

        <h2 className="text-2xl font-bold text-white text-center mb-2">{word.korean}</h2>

        <div className="flex justify-center">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handlePlaySound}
            className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-xl transition-colors"
          >
            <Volume2 className="w-5 h-5 text-white" />
            <span className="text-white text-sm">발음 듣기</span>
          </motion.button>
        </div>
      </motion.div>

      {/* Input Area */}
      <div className="relative mb-4">
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isAnswered}
          placeholder="영어 단어를 입력하세요"
          className={`w-full px-4 py-4 text-xl text-center rounded-xl border-2 outline-none transition-all ${
            isAnswered
              ? isCorrect
                ? 'bg-green-100 dark:bg-green-900/50 border-green-500 text-green-800 dark:text-green-200'
                : 'bg-red-100 dark:bg-red-900/50 border-red-500 text-red-800 dark:text-red-200'
              : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 focus:border-indigo-500'
          }`}
          autoComplete="off"
          autoCapitalize="off"
          spellCheck={false}
        />

        {isAnswered && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className={`absolute right-4 top-1/2 -translate-y-1/2 ${
              isCorrect ? 'text-green-500' : 'text-red-500'
            }`}
          >
            {isCorrect ? <Check className="w-6 h-6" /> : <X className="w-6 h-6" />}
          </motion.div>
        )}
      </div>

      {/* Answer Display */}
      {isAnswered && !isCorrect && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-4"
        >
          <p className="text-slate-500 dark:text-slate-400 mb-1">정답:</p>
          <p className="text-xl font-bold text-indigo-600 dark:text-indigo-400">{word.english}</p>
        </motion.div>
      )}

      {/* Submit Button */}
      {!isAnswered && (
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={checkAnswer}
          disabled={!input.trim()}
          className={`w-full flex items-center justify-center gap-2 py-4 rounded-xl font-medium transition-all ${
            input.trim()
              ? 'bg-indigo-500 hover:bg-indigo-600 text-white'
              : 'bg-slate-200 dark:bg-slate-700 text-slate-400 cursor-not-allowed'
          }`}
        >
          확인하기
          <ArrowRight className="w-5 h-5" />
        </motion.button>
      )}
    </div>
  );
}
