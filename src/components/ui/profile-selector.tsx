// src/components/ui/profile-selector.tsx
'use client'

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronDown } from 'lucide-react';
import { useProfile } from '@/contexts/ProfileContext';
import { ProfileType, PROFILE_TYPES } from '@/types/profile';

export function ProfileSelector() {
  const { currentProfile, setCurrentProfile, getProfileInfo } = useProfile();
  const [isOpen, setIsOpen] = useState(false);

  const currentProfileInfo = getProfileInfo(currentProfile);

  const handleProfileChange = (profile: ProfileType) => {
    setCurrentProfile(profile);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <Button
        variant="outline"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 h-9 px-3 border-gray-200 text-gray-700 hover:bg-gray-50"
      >
        <span className="text-sm">{currentProfileInfo.icon}</span>
        <span className="text-sm font-medium">{currentProfileInfo.name}</span>
        <ChevronDown className="w-4 h-4" />
      </Button>

      {isOpen && (
        <>
          {/* Overlay para fechar ao clicar fora */}
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown */}
          <div className="absolute right-0 top-full mt-1 w-56 bg-white border border-gray-200 rounded-md shadow-lg z-20">
            <div className="py-1">
              {Object.values(PROFILE_TYPES).map((profile) => (
                <button
                  key={profile.type}
                  onClick={() => handleProfileChange(profile.type)}
                  className={`w-full text-left px-4 py-3 hover:bg-gray-50 flex items-center gap-3 ${
                    currentProfile === profile.type ? 'bg-gray-50' : ''
                  }`}
                >
                  <span className="text-lg">{profile.icon}</span>
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {profile.name}
                    </div>
                    <div className="text-xs text-gray-500">
                      {profile.description}
                    </div>
                  </div>
                  {currentProfile === profile.type && (
                    <div className="ml-auto w-2 h-2 bg-gray-900 rounded-full" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
