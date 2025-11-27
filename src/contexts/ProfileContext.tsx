// src/contexts/ProfileContext.tsx
'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ProfileType, PROFILE_TYPES } from '@/types/profile';
import { useAuth } from '@/contexts/AuthContext';

interface ProfileContextType {
  currentProfile: ProfileType;
  setCurrentProfile: (profile: ProfileType) => void;
  getProfileInfo: (profile: ProfileType) => typeof PROFILE_TYPES[ProfileType];
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

// Função para determinar o perfil baseado no tipo de usuário
// Os tipos devem ser: 'vendedor', 'empresa' ou 'admin'
function determineProfileFromUserType(tipo?: string): ProfileType {
  // Validar se o tipo é um dos tipos permitidos
  if (tipo === 'vendedor' || tipo === 'empresa' || tipo === 'admin') {
    return tipo as ProfileType;
  }
  // Padrão: vendedor
  return 'vendedor';
}

export function ProfileProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [currentProfile, setCurrentProfileState] = useState<ProfileType>('vendedor');

  // Inicializar perfil baseado no tipo de usuário
  useEffect(() => {
    if (user) {
      // Determinar perfil baseado no tipo de usuário (vendedor, empresa ou admin)
      const userProfile = determineProfileFromUserType(user.tipo);
      setCurrentProfileState(userProfile);
      // Salvar no localStorage para manter consistência
      localStorage.setItem('currentProfile', userProfile);
    }
  }, [user]);

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
