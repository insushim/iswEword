'use client';
import { useCallback, useState, useEffect, useRef } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { TTSSettings } from '@/types';

// 선호하는 영어 네이티브 음성 목록 (우선순위 순)
const PREFERRED_VOICES = [
  // Google 고품질 음성 (가장 자연스러움)
  'Google US English',
  'Google UK English Female',
  'Google UK English Male',
  // Microsoft 음성
  'Microsoft Zira - English (United States)',
  'Microsoft David - English (United States)',
  'Microsoft Mark - English (United States)',
  'Microsoft Aria Online (Natural) - English (United States)',
  'Microsoft Guy Online (Natural) - English (United States)',
  'Microsoft Jenny Online (Natural) - English (United States)',
  // Apple 음성
  'Samantha',
  'Alex',
  'Karen',
  'Daniel',
  'Moira',
  // 기타 네이티브 영어
  'English United States',
  'English (United States)',
];

// 피해야 할 음성 패턴 (콩글리시/비네이티브)
const AVOID_VOICE_PATTERNS = [
  /korean/i,
  /한국/i,
  /yuna/i,
  /heami/i,
];

export function useTTS() {
  const [settings, setSettings] = useLocalStorage<TTSSettings>('tts-settings', {
    accent: 'en-US',
    speed: 0.9, // 약간 느리게 (아이들을 위해)
    autoPlay: true,
  });
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const selectedVoiceRef = useRef<SpeechSynthesisVoice | null>(null);

  useEffect(() => {
    const loadVoices = () => {
      const allVoices = speechSynthesis.getVoices();

      // 영어 음성만 필터링
      const englishVoices = allVoices.filter((v) =>
        v.lang.startsWith('en') &&
        !AVOID_VOICE_PATTERNS.some(pattern => pattern.test(v.name))
      );

      setVoices(englishVoices);

      // 최적의 음성 선택
      selectedVoiceRef.current = findBestVoice(englishVoices, settings.accent);

      // 디버그용 로그 (개발 시에만)
      if (process.env.NODE_ENV === 'development') {
        console.log('Available English voices:', englishVoices.map(v => `${v.name} (${v.lang})`));
        console.log('Selected voice:', selectedVoiceRef.current?.name);
      }
    };

    // 음성 로드
    loadVoices();

    // Chrome에서는 onvoiceschanged 이벤트가 필요
    if (typeof window !== 'undefined' && speechSynthesis) {
      speechSynthesis.onvoiceschanged = loadVoices;
    }

    return () => {
      if (typeof window !== 'undefined' && speechSynthesis) {
        speechSynthesis.onvoiceschanged = null;
      }
    };
  }, [settings.accent]);

  // 최적의 영어 네이티브 음성 찾기
  const findBestVoice = (
    availableVoices: SpeechSynthesisVoice[],
    preferredAccent: string
  ): SpeechSynthesisVoice | null => {
    if (availableVoices.length === 0) return null;

    // 1. 선호 목록에서 찾기
    for (const preferred of PREFERRED_VOICES) {
      const voice = availableVoices.find(
        (v) => v.name.includes(preferred) || v.name === preferred
      );
      if (voice) return voice;
    }

    // 2. 설정된 억양(en-US, en-GB 등)에 맞는 음성 찾기
    const accentVoice = availableVoices.find((v) => v.lang === preferredAccent);
    if (accentVoice) return accentVoice;

    // 3. en-US 음성 찾기 (기본)
    const usVoice = availableVoices.find((v) => v.lang === 'en-US');
    if (usVoice) return usVoice;

    // 4. en-GB 음성 찾기
    const gbVoice = availableVoices.find((v) => v.lang === 'en-GB');
    if (gbVoice) return gbVoice;

    // 5. 아무 영어 음성이나 반환
    return availableVoices[0] || null;
  };

  const speak = useCallback(
    (text: string) => {
      if (typeof window === 'undefined' || !speechSynthesis) return;

      // 이전 발화 취소
      speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);

      // 속도 설정 (아이들을 위해 약간 느리게)
      utterance.rate = settings.speed;
      utterance.pitch = 1;
      utterance.volume = 1;

      // 최적의 음성 선택
      const voice = selectedVoiceRef.current || findBestVoice(voices, settings.accent);

      if (voice) {
        utterance.voice = voice;
        utterance.lang = voice.lang;
      } else {
        // 음성이 없으면 언어만 설정
        utterance.lang = settings.accent;
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

  // 음성 미리듣기 (설정에서 사용)
  const previewVoice = useCallback((voiceName: string) => {
    if (typeof window === 'undefined' || !speechSynthesis) return;

    speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance('Hello! This is a sample voice.');
    utterance.rate = settings.speed;

    const voice = voices.find((v) => v.name === voiceName);
    if (voice) {
      utterance.voice = voice;
      utterance.lang = voice.lang;
    }

    speechSynthesis.speak(utterance);
  }, [voices, settings.speed]);

  return {
    speak,
    stop,
    isSpeaking,
    settings,
    setSettings,
    voices,
    previewVoice,
    currentVoice: selectedVoiceRef.current?.name || 'Default'
  };
}
