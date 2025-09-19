// src/contexts/ProfileContext.tsx
'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ProfileType, PROFILE_TYPES } from '@/types/profile';

interface ProfileContextType {
  currentProfile: ProfileType;
  setCurrentProfile: (profile: ProfileType) => void;
  getProfileInfo: (profile: ProfileType) => typeof PROFILE_TYPES[ProfileType];
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export function ProfileProvider({ children }: { children: ReactNode }) {
  const [currentProfile, setCurrentProfileState] = useState<ProfileType>('usuario');

  // Carregar perfil salvo no localStorage
  useEffect(() => {
    const savedProfile = localStorage.getItem('currentProfile') as ProfileType;
    if (savedProfile && PROFILE_TYPES[savedProfile]) {
      setCurrentProfileState(savedProfile);
    }
  }, []);

  const setCurrentProfile = (profile: ProfileType) => {
    setCurrentProfileState(profile);
    localStorage.setItem('currentProfile', profile);
  };

  const getProfileInfo = (profile: ProfileType) => {
    return PROFILE_TYPES[profile];
  };

  return (
    <ProfileContext.Provider value={{
      currentProfile,
      setCurrentProfile,
      getProfileInfo
    }}>
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  const context = useContext(ProfileContext);
  if (context === undefined) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
}
