'use client';

import { useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';

interface ConfettiProps {
  active: boolean;
  duration?: number;
}

export default function Confetti({ active, duration = 3000 }: ConfettiProps) {
  const hasTriggered = useRef(false);

  useEffect(() => {
    if (!active || hasTriggered.current) return;

    hasTriggered.current = true;

    const end = Date.now() + duration;

    const colors = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981'];

    const frame = () => {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: colors,
      });

      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: colors,
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };

    frame();

    // Big burst at start
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: colors,
    });
  }, [active, duration]);

  useEffect(() => {
    if (!active) {
      hasTriggered.current = false;
    }
  }, [active]);

  return null;
}
