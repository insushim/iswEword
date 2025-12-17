'use client';
import { useCallback, useRef, useEffect } from 'react';
import { useLocalStorage } from './useLocalStorage';

type SoundType = 'correct' | 'wrong' | 'flip' | 'levelUp' | 'achievement' | 'click' | 'complete';

export function useSound() {
  const [soundEnabled, setSoundEnabled] = useLocalStorage('sound-enabled', true);
  const audioContextRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    const initAudio = () => {
      if (!audioContextRef.current && typeof window !== 'undefined') {
        audioContextRef.current = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      }
    };

    const handleInteraction = () => {
      initAudio();
      if (audioContextRef.current?.state === 'suspended') {
        audioContextRef.current.resume();
      }
    };

    window.addEventListener('click', handleInteraction, { once: true });
    window.addEventListener('touchstart', handleInteraction, { once: true });

    return () => {
      window.removeEventListener('click', handleInteraction);
      window.removeEventListener('touchstart', handleInteraction);
    };
  }, []);

  const playTone = useCallback(
    (freq: number, duration: number, type: OscillatorType = 'sine', volume: number = 0.3) => {
      if (!soundEnabled || !audioContextRef.current) return;

      const ctx = audioContextRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);

      gain.gain.setValueAtTime(volume, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);

      osc.start();
      osc.stop(ctx.currentTime + duration);
    },
    [soundEnabled]
  );

  const playSound = useCallback(
    (sound: SoundType) => {
      if (!soundEnabled) return;

      switch (sound) {
        case 'correct':
          playTone(523, 0.1);
          setTimeout(() => playTone(659, 0.1), 100);
          setTimeout(() => playTone(784, 0.2), 200);
          break;
        case 'wrong':
          playTone(311, 0.3, 'sawtooth', 0.2);
          break;
        case 'flip':
          playTone(440, 0.05, 'sine', 0.2);
          break;
        case 'levelUp':
          playTone(523, 0.1);
          setTimeout(() => playTone(659, 0.1), 100);
          setTimeout(() => playTone(784, 0.1), 200);
          setTimeout(() => playTone(1047, 0.3), 300);
          break;
        case 'achievement':
          playTone(784, 0.1);
          setTimeout(() => playTone(988, 0.1), 100);
          setTimeout(() => playTone(1175, 0.2), 200);
          break;
        case 'click':
          playTone(600, 0.02, 'sine', 0.1);
          break;
        case 'complete':
          playTone(523, 0.15);
          setTimeout(() => playTone(659, 0.15), 150);
          setTimeout(() => playTone(784, 0.15), 300);
          setTimeout(() => playTone(1047, 0.4), 450);
          break;
      }
    },
    [soundEnabled, playTone]
  );

  return { playSound, soundEnabled, setSoundEnabled };
}
