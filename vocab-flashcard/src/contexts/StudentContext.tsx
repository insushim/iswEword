'use client';

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';

export interface StudentProfile {
  id: string;
  name: string;
  createdAt: string;
  lastActiveAt: string;
}

interface StudentContextType {
  profiles: StudentProfile[];
  currentProfile: StudentProfile | null;
  isLoading: boolean;
  isLoggedIn: boolean;
  createProfile: (name: string) => StudentProfile;
  selectProfile: (profileId: string) => void;
  deleteProfile: (profileId: string) => void;
  logout: () => void;
  getStorageKey: (baseKey: string) => string;
}

const StudentContext = createContext<StudentContextType | null>(null);

const PROFILES_KEY = 'student-profiles';
const CURRENT_PROFILE_KEY = 'current-student-profile';

export function StudentProvider({ children }: { children: ReactNode }) {
  const [profiles, setProfiles] = useState<StudentProfile[]>([]);
  const [currentProfile, setCurrentProfile] = useState<StudentProfile | null>(null);
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
            // 마지막 활동 시간 업데이트
            const updated = { ...current, lastActiveAt: new Date().toISOString() };
            setCurrentProfile(updated);

            // 프로필 목록도 업데이트
            const updatedProfiles = parsedProfiles.map(p =>
              p.id === savedCurrentId ? updated : p
            );
            localStorage.setItem(PROFILES_KEY, JSON.stringify(updatedProfiles));
          }
        }
      }
    } catch (error) {
      console.error('Error loading profiles:', error);
    }
    setIsLoading(false);
  }, []);

  const createProfile = useCallback((name: string): StudentProfile => {
    const newProfile: StudentProfile = {
      id: `student-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: name.trim(),
      createdAt: new Date().toISOString(),
      lastActiveAt: new Date().toISOString(),
    };

    setProfiles(prev => {
      const updated = [...prev, newProfile];
      localStorage.setItem(PROFILES_KEY, JSON.stringify(updated));
      return updated;
    });

    setCurrentProfile(newProfile);
    localStorage.setItem(CURRENT_PROFILE_KEY, newProfile.id);

    return newProfile;
  }, []);

  const selectProfile = useCallback((profileId: string) => {
    setProfiles(prev => {
      const profile = prev.find(p => p.id === profileId);
      if (profile) {
        const updated = { ...profile, lastActiveAt: new Date().toISOString() };
        const updatedProfiles = prev.map(p => p.id === profileId ? updated : p);
        localStorage.setItem(PROFILES_KEY, JSON.stringify(updatedProfiles));
        setCurrentProfile(updated);
        localStorage.setItem(CURRENT_PROFILE_KEY, profileId);
        return updatedProfiles;
      }
      return prev;
    });
  }, []);

  const deleteProfile = useCallback((profileId: string) => {
    // 해당 프로필의 데이터 삭제
    const keysToDelete = [
      `user-progress-${profileId}`,
      `leitner-data-${profileId}`,
      `study-sessions-${profileId}`,
    ];
    keysToDelete.forEach(key => localStorage.removeItem(key));

    setProfiles(prev => {
      const updated = prev.filter(p => p.id !== profileId);
      localStorage.setItem(PROFILES_KEY, JSON.stringify(updated));
      return updated;
    });

    if (currentProfile?.id === profileId) {
      setCurrentProfile(null);
      localStorage.removeItem(CURRENT_PROFILE_KEY);
    }
  }, [currentProfile]);

  const logout = useCallback(() => {
    setCurrentProfile(null);
    localStorage.removeItem(CURRENT_PROFILE_KEY);
  }, []);

  const getStorageKey = useCallback((baseKey: string) => {
    return currentProfile ? `${baseKey}-${currentProfile.id}` : baseKey;
  }, [currentProfile]);

  return (
    <StudentContext.Provider
      value={{
        profiles,
        currentProfile,
        isLoading,
        isLoggedIn: !!currentProfile,
        createProfile,
        selectProfile,
        deleteProfile,
        logout,
        getStorageKey,
      }}
    >
      {children}
    </StudentContext.Provider>
  );
}

export function useStudent() {
  const context = useContext(StudentContext);
  if (!context) {
    throw new Error('useStudent must be used within a StudentProvider');
  }
  return context;
}
