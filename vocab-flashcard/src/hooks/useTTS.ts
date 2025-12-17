'use client';
import { useCallback, useState, useEffect } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { TTSSettings } from '@/types';

export function useTTS() {
  const [settings, setSettings] = useLocalStorage<TTSSettings>('tts-settings', {
    accent: 'en-US',
    speed: 1,
    autoPlay: true,
  });
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = speechSynthesis.getVoices().filter((v) => v.lang.startsWith('en'));
      setVoices(availableVoices);
    };

    loadVoices();

    if (typeof window !== 'undefined' && speechSynthesis) {
      speechSynthesis.onvoiceschanged = loadVoices;
    }

    return () => {
      if (typeof window !== 'undefined' && speechSynthesis) {
        speechSynthesis.onvoiceschanged = null;
      }
    };
  }, []);

  const speak = useCallback(
    (text: string) => {
      if (typeof window === 'undefined' || !speechSynthesis) return;

      speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = settings.speed;
      utterance.pitch = 1;
      utterance.volume = 1;

      const targetLang = settings.accent;
      const voice = voices.find((v) => v.lang === targetLang) || voices.find((v) => v.lang.startsWith('en'));

      if (voice) {
        utterance.voice = voice;
      }

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      speechSynthesis.speak(utterance);
    },
    [settings, voices]
  );

  const stop = useCallback(() => {
    if (typeof window !== 'undefined' && speechSynthesis) {
      speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  }, []);

  return { speak, stop, isSpeaking, settings, setSettings, voices };
}
