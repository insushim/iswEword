'use client';

import { useState, useCallback } from 'react';
import { generatePIN, saveSyncData, loadSyncData, SyncData } from '@/lib/supabase';

const EXPIRY_DAYS = 7;

export function useSync() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastSyncPIN, setLastSyncPIN] = useState<string | null>(null);

  // 데이터 업로드 (PIN 생성)
  const uploadData = useCallback(async (
    profileName: string,
    leitnerData: Record<string, unknown>,
    progressData: unknown,
    studySessions: unknown[]
  ): Promise<{ success: boolean; pin?: string }> => {
    setIsLoading(true);
    setError(null);

    try {
      const pin = generatePIN();
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + EXPIRY_DAYS);

      const result = await saveSyncData({
        pin,
        profile_name: profileName,
        leitner_data: leitnerData,
        progress_data: progressData as Record<string, unknown>,
        study_sessions: studySessions,
        expires_at: expiresAt.toISOString(),
      });

      if (result.success) {
        setLastSyncPIN(pin);
        return { success: true, pin };
      } else {
        setError(result.error || '업로드 실패');
        return { success: false };
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : '업로드 중 오류 발생';
      setError(message);
      return { success: false };
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 데이터 다운로드 (PIN 입력)
  const downloadData = useCallback(async (pin: string): Promise<{
    success: boolean;
    data?: {
      profileName: string;
      leitnerData: Record<string, unknown>;
      progressData: Record<string, unknown>;
      studySessions: unknown[];
    };
  }> => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await loadSyncData(pin);

      if (result.success && result.data) {
        return {
          success: true,
          data: {
            profileName: result.data.profile_name,
            leitnerData: result.data.leitner_data,
            progressData: result.data.progress_data,
            studySessions: result.data.study_sessions as unknown[],
          },
        };
      } else {
        setError(result.error || '다운로드 실패');
        return { success: false };
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : '다운로드 중 오류 발생';
      setError(message);
      return { success: false };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    isLoading,
    error,
    lastSyncPIN,
    uploadData,
    downloadData,
    clearError,
  };
}
