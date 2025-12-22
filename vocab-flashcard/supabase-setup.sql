-- Supabase 테이블 생성 SQL
-- Supabase 대시보드 > SQL Editor에서 실행하세요

-- sync_data 테이블 생성
CREATE TABLE IF NOT EXISTS sync_data (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  pin VARCHAR(6) NOT NULL UNIQUE,
  profile_name VARCHAR(100) NOT NULL,
  leitner_data JSONB DEFAULT '{}'::jsonb,
  progress_data JSONB DEFAULT '{}'::jsonb,
  study_sessions JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL
);

-- PIN 인덱스 생성 (빠른 조회용)
CREATE INDEX IF NOT EXISTS idx_sync_data_pin ON sync_data(pin);

-- 만료된 데이터 자동 삭제를 위한 인덱스
CREATE INDEX IF NOT EXISTS idx_sync_data_expires_at ON sync_data(expires_at);

-- RLS (Row Level Security) 활성화
ALTER TABLE sync_data ENABLE ROW LEVEL SECURITY;

-- 모든 사용자가 읽기/쓰기 가능하도록 정책 설정 (공개 앱용)
CREATE POLICY "Allow anonymous access" ON sync_data
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- 만료된 데이터 자동 삭제 함수 (선택적)
CREATE OR REPLACE FUNCTION cleanup_expired_sync_data()
RETURNS void AS $$
BEGIN
  DELETE FROM sync_data WHERE expires_at < NOW();
END;
$$ LANGUAGE plpgsql;
