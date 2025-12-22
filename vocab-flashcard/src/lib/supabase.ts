import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// PIN 동기화 데이터 타입
export interface SyncData {
  id?: string;
  pin: string;
  profile_name: string;
  leitner_data: Record<string, unknown>;
  progress_data: Record<string, unknown>;
  study_sessions: unknown[];
  created_at?: string;
  expires_at: string;
}

// 6자리 PIN 생성
export function generatePIN(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// PIN으로 데이터 저장
export async function saveSyncData(data: Omit<SyncData, 'id' | 'created_at'>): Promise<{ success: boolean; pin?: string; error?: string }> {
  try {
    // 기존 PIN 삭제 (같은 프로필)
    await supabase
      .from('sync_data')
      .delete()
      .eq('pin', data.pin);

    const { error } = await supabase
      .from('sync_data')
      .insert([data]);

    if (error) {
      console.error('Supabase save error:', error);
      return { success: false, error: error.message };
    }

    return { success: true, pin: data.pin };
  } catch (err) {
    console.error('Save sync data error:', err);
    return { success: false, error: '저장 중 오류가 발생했습니다.' };
  }
}

// PIN으로 데이터 불러오기
export async function loadSyncData(pin: string): Promise<{ success: boolean; data?: SyncData; error?: string }> {
  try {
    const { data, error } = await supabase
      .from('sync_data')
      .select('*')
      .eq('pin', pin)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return { success: false, error: 'PIN을 찾을 수 없습니다.' };
      }
      console.error('Supabase load error:', error);
      return { success: false, error: error.message };
    }

    // 만료 확인
    if (new Date(data.expires_at) < new Date()) {
      return { success: false, error: 'PIN이 만료되었습니다.' };
    }

    return { success: true, data: data as SyncData };
  } catch (err) {
    console.error('Load sync data error:', err);
    return { success: false, error: '불러오기 중 오류가 발생했습니다.' };
  }
}

// 만료된 데이터 정리 (선택적)
export async function cleanupExpiredData(): Promise<void> {
  try {
    await supabase
      .from('sync_data')
      .delete()
      .lt('expires_at', new Date().toISOString());
  } catch (err) {
    console.error('Cleanup error:', err);
  }
}
