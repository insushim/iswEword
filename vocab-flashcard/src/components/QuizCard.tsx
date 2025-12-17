'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Volume2 } from 'lucide-react';
import { QuizQuestion } from '@/types';
import { useTTS } from '@/hooks/useTTS';
import { useSound } from '@/hooks/useSound';

interface QuizCardProps {
  question: QuizQuestion;
  onAnswer: (correct: boolean) => void;
  questionNumber: number;
  totalQuestions: number;
}

export default function QuizCard({ question, onAnswer, questionNumber, totalQuestions }: QuizCardProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const { speak } = useTTS();
  const { playSound } = useSound();

  useEffect(() => {
    speak(question.word.english);
  }, [question.word.english, speak]);

  useEffect(() => {
    setSelectedAnswer(null);
    setIsAnswered(false);
  }, [question.word.id]);

  const handleSelectAnswer = (answer: string) => {
    if (isAnswered) return;

    setSelectedAnswer(answer);
    setIsAnswered(true);

    const isCorrect = answer === question.correctAnswer;

    if (isCorrect) {
      playSound('correct');
    } else {
      playSound('wrong');
    }

    setTimeout(() => {
      onAnswer(isCorrect);
    }, 1000);
  };

  const getOptionStyle = (option: string) => {
    if (!isAnswered) {
      return 'bg-white dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-slate-700 border-slate-200 dark:border-slate-700';
    }

    if (option === question.correctAnswer) {
      return 'bg-green-100 dark:bg-green-900/50 border-green-500 text-green-800 dark:text-green-200';
    }

    if (option === selectedAnswer && option !== question.correctAnswer) {
      return 'bg-red-100 dark:bg-red-900/50 border-red-500 text-red-800 dark:text-red-200 shake';
    }

    return 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 opacity-50';
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Progress */}
      <div className="text-center mb-6">
        <span className="text-sm text-slate-500 dark:text-slate-400">
          문제 {questionNumber} / {totalQuestions}
        </span>
      </div>

      {/* Question Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl p-6 shadow-xl mb-6"
      >
        <div className="flex items-center justify-center gap-3 mb-4">
          <span className="text-5xl">{question.word.emoji}</span>
        </div>

        <div className="flex items-center justify-center gap-3">
          <h2 className="text-3xl font-bold text-white">{question.word.english}</h2>
          <button
            onClick={() => speak(question.word.english)}
            className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
          >
            <Volume2 className="w-5 h-5 text-white" />
          </button>
        </div>

        <p className="text-center text-white/80 mt-2 text-sm">이 단어의 뜻은 무엇일까요?</p>
      </motion.div>

      {/* Options */}
      <div className="space-y-3">
        {question.options.map((option, index) => (
          <motion.button
            key={option}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => handleSelectAnswer(option)}
            disabled={isAnswered}
            className={`w-full p-4 rounded-xl border-2 text-left font-medium transition-all ${getOptionStyle(option)}`}
          >
            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-sm mr-3">
              {index + 1}
            </span>
            {option}
          </motion.button>
        ))}
      </div>
    </div>
  );
}
