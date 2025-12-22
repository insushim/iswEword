'use client';

import { useState, useEffect, useCallback } from 'react';

export interface StudentProfile {
  id: string;
  name: string;
  createdAt: string;
  lastActiveAt: string;
}

const PROFILES_KEY = 'student-profiles';
const CURRENT_PROFILE_KEY = 'current-student-profile';

export function useStudentProfile() {
  const [profiles, setProfiles] = useState<StudentProfile[]>([]);
  const [currentProfile, setCurrentProfileState] = useState<StudentProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 초기 로드
  useEffect(() => {
    try {
      const savedProfiles = localStorage.getItem(PROFILES_KEY);
      const savedCurrentId = localStorage.getItem(CURRENT_PROFILE_KEY);

      if (savedProfiles) {
        const parsedProfiles = JSON.parse(savedProfiles) as StudentProfile[];
        setProfiles(parsedProfiles);

        if (savedCurrentId) {
          const current = parsedProfiles.find(p => p.id === savedCurrentId);
          if (current) {
            setCurrentProfileState(current);
          }
        }
      }
    } catch (error) {
      console.error('Error loading profiles:', error);
    }
    setIsLoading(false);
  }, []);

  // 프로필 생성
  const createProfile = useCallback((name: string): StudentProfile => {
    const newProfile: StudentProfile = {
      id: `student-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: name.trim(),
      createdAt: new Date().toISOString(),
      lastActiveAt: new Date().toISOString(),
    };

    const updatedProfiles = [...profiles, newProfile];
    setProfiles(updatedProfiles);
    localStorage.setItem(PROFILES_KEY, JSON.stringify(updatedProfiles));

    // 새 프로필로 전환
    setCurrentProfileState(newProfile);
    localStorage.setItem(CURRENT_PROFILE_KEY, newProfile.id);

    return newProfile;
  }, [profiles]);

  // 프로필 선택
  const selectProfile = useCallback((profileId: string) => {
    const profile = profiles.find(p => p.id === profileId);
    if (profile) {
      // 마지막 활동 시간 업데이트
      const updatedProfile = { ...profile, lastActiveAt: new Date().toISOString() };
      const updatedProfiles = profiles.map(p => p.id === profileId ? updatedProfile : p);

      setProfiles(updatedProfiles);
      setCurrentProfileState(updatedProfile);

      localStorage.setItem(PROFILES_KEY, JSON.stringify(updatedProfiles));
      localStorage.setItem(CURRENT_PROFILE_KEY, profileId);
    }
  }, [profiles]);

  // 프로필 삭제
  const deleteProfile = useCallback((profileId: string) => {
    const updatedProfiles = profiles.filter(p => p.id !== profileId);
    setProfiles(updatedProfiles);
    localStorage.setItem(PROFILES_KEY, JSON.stringify(updatedProfiles));

    // 해당 프로필의 데이터도 삭제
    const keysToDelete = [
      `user-progress-${profileId}`,
      `leitner-data-${profileId}`,
      `study-sessions-${profileId}`,
    ];
    keysToDelete.forEach(key => localStorage.removeItem(key));

    // 현재 프로필이 삭제되면 초기화
    if (currentProfile?.id === profileId) {
      setCurrentProfileState(null);
      localStorage.removeItem(CURRENT_PROFILE_KEY);
    }
  }, [profiles, currentProfile]);

  // 로그아웃 (프로필 선택 화면으로)
  const logout = useCallback(() => {
    setCurrentProfileState(null);
    localStorage.removeItem(CURRENT_PROFILE_KEY);
  }, []);

  // 현재 프로필의 저장 키 접두사 반환
  const getStorageKeyPrefix = useCallback(() => {
    return currentProfile ? currentProfile.id : 'guest';
  }, [currentProfile]);

  return {
    profiles,
    currentProfile,
    isLoading,
    createProfile,
    selectProfile,
    deleteProfile,
    logout,
    getStorageKeyPrefix,
    isLoggedIn: !!currentProfile,
  };
}
