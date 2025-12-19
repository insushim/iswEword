'use client';

import { useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import { LeitnerData } from '@/types';

interface BoxChartProps {
  stats: {
    boxes: Record<number, number>;
    totalLearned: number;
    totalCorrect: number;
    totalWrong: number;
  };
}

const BOX_COLORS = ['#ef4444', '#f97316', '#eab308', '#3b82f6', '#22c55e'];
const BOX_NAMES = ['Box 1 (매일)', 'Box 2 (2일)', 'Box 3 (4일)', 'Box 4 (7일)', 'Box 5 (완료)'];

export function BoxChart({ stats }: BoxChartProps) {
  const data = useMemo(() => {
    return Object.entries(stats.boxes).map(([box, count]) => ({
      name: BOX_NAMES[parseInt(box) - 1],
      count,
      fill: BOX_COLORS[parseInt(box) - 1],
    }));
  }, [stats.boxes]);

  if (stats.totalLearned === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-48 text-slate-500 dark:text-slate-400">
        <span className="text-4xl mb-2">📊</span>
        <p>아직 학습 데이터가 없어요</p>
      </div>
    );
  }

  return (
    <div className="h-64 min-h-[256px]">
      <ResponsiveContainer width="100%" height="100%" minWidth={200} minHeight={200}>
        <BarChart data={data} margin={{ top: 20, right: 20, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
          <XAxis dataKey="name" tick={{ fontSize: 12 }} />
          <YAxis allowDecimals={false} />
          <Tooltip
            contentStyle={{
              backgroundColor: 'var(--card-bg)',
              border: 'none',
              borderRadius: '12px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            }}
          />
          <Bar dataKey="count" radius={[8, 8, 0, 0]}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function AccuracyPieChart({ stats }: BoxChartProps) {
  const data = useMemo(() => {
    const total = stats.totalCorrect + stats.totalWrong;
    if (total === 0) return [];

    return [
      { name: '정답', value: stats.totalCorrect, color: '#22c55e' },
      { name: '오답', value: stats.totalWrong, color: '#ef4444' },
    ];
  }, [stats]);

  if (data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-48 text-slate-500 dark:text-slate-400">
        <span className="text-4xl mb-2">🎯</span>
        <p>아직 학습 데이터가 없어요</p>
      </div>
    );
  }

  const accuracy = Math.round((stats.totalCorrect / (stats.totalCorrect + stats.totalWrong)) * 100);

  return (
    <div className="h-64 min-h-[256px] relative">
      <ResponsiveContainer width="100%" height="100%" minWidth={200} minHeight={200}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={50}
            outerRadius={80}
            paddingAngle={5}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: 'var(--card-bg)',
              border: 'none',
              borderRadius: '12px',
            }}
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="text-center">
          <div className="text-2xl font-bold text-slate-800 dark:text-white">{accuracy}%</div>
          <div className="text-xs text-slate-500 dark:text-slate-400">정확도</div>
        </div>
      </div>
    </div>
  );
}

interface LevelProgressProps {
  leitnerData: Record<number, LeitnerData>;
  wordCountByLevel: Record<number, number>;
}

export function LevelProgress({ leitnerData, wordCountByLevel }: LevelProgressProps) {
  const data = useMemo(() => {
    const levelStats: Record<number, { total: number; learned: number; mastered: number }> = {};

    // Initialize
    for (let i = 1; i <= 5; i++) {
      levelStats[i] = { total: wordCountByLevel[i] || 0, learned: 0, mastered: 0 };
    }

    // Count learned words by level (you'd need word data to properly implement this)
    // For now, just showing total learned
    Object.values(leitnerData).forEach((data) => {
      // This is simplified - in real implementation, we'd need word level info
      if (data.box >= 1) levelStats[1].learned++;
      if (data.box >= 5) levelStats[1].mastered++;
    });

    return Object.entries(levelStats).map(([level, stats]) => ({
      level: `레벨 ${level}`,
      total: stats.total,
      learned: Math.min(stats.learned, stats.total),
      progress: stats.total > 0 ? Math.round((stats.learned / stats.total) * 100) : 0,
    }));
  }, [leitnerData, wordCountByLevel]);

  return (
    <div className="space-y-4">
      {data.map((item) => (
        <div key={item.level}>
          <div className="flex justify-between text-sm mb-1">
            <span className="font-medium text-slate-700 dark:text-slate-200">{item.level}</span>
            <span className="text-slate-500 dark:text-slate-400">
              {item.learned} / {item.total} ({item.progress}%)
            </span>
          </div>
          <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-500"
              style={{ width: `${item.progress}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
