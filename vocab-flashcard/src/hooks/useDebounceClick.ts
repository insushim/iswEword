'use client';

import { useRef, useCallback } from 'react';

/**
 * 버튼 연속 클릭 방지 훅
 * @param delay 클릭 간 딜레이 (기본 400ms)
 */
export function useDebounceClick(delay: number = 400) {
  const isDisabled = useRef(false);

  const debounceClick = useCallback(
    <T extends (...args: Parameters<T>) => void>(callback: T) => {
      return (...args: Parameters<T>) => {
        if (isDisabled.current) return;

        isDisabled.current = true;
        callback(...args);

        setTimeout(() => {
          isDisabled.current = false;
        }, delay);
      };
    },
    [delay]
  );

  return { debounceClick, isDisabled };
}
