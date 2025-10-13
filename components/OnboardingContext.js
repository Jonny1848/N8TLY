// components/OnboardingContext.js
import { createContext, useContext, useState } from 'react';

const OnboardingContext = createContext({
  profileData: {},
  updateProfileData: () => {},
  resetProfileData: () => {},
});

export function OnboardingProvider({ children }) {
  const [profileData, setProfileData] = useState({
    username: '',
    age: '',
    isPublic: true,
    favoriteCity: '',
    locationEnabled: false,
    avatarUri: null,
    musicGenres: [],
    partyPreferences: [],
    bio: '',
    partyTypes: [],
  });

  const updateProfileData = (updates) => {
    setProfileData(prev => ({ ...prev, ...updates }));
  };

  const resetProfileData = () => {
    setProfileData({
      username: '',
      age: '',
      isPublic: true,
      favoriteCity: '',
      locationEnabled: false,
      avatarUri: null,
      musicGenres: [],
      partyPreferences: [],
      bio: '',
      partyTypes: [],
    });
  };

  return (
    <OnboardingContext.Provider value={{ profileData, updateProfileData, resetProfileData }}>
      {children}
    </OnboardingContext.Provider>
  );
}

export function useOnboarding() {
  return useContext(OnboardingContext);
}