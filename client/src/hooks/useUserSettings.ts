import { useState, useEffect } from "react";
import { useAuth } from "./useAuth";

interface UserSettings {
  scrollButtonPosition: 'bottom-left' | 'bottom-right' | 'top-left' | 'top-right';
  theme: 'light' | 'dark' | 'auto';
  language: string;
}

const defaultSettings: UserSettings = {
  scrollButtonPosition: 'bottom-left',
  theme: 'light',
  language: 'en'
};

export function useUserSettings() {
  const { isAuthenticated } = useAuth();
  const [settings, setSettings] = useState<UserSettings>(defaultSettings);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isAuthenticated) {
      const storedSettings = localStorage.getItem('userSettings');
      if (storedSettings) {
        setSettings({ ...defaultSettings, ...JSON.parse(storedSettings) });
      }
    } else {
      setSettings(defaultSettings);
    }
    setIsLoading(false);
  }, [isAuthenticated]);

  const updateSettings = (newSettings: Partial<UserSettings>) => {
    if (!isAuthenticated) return;
    
    const updatedSettings = { ...settings, ...newSettings };
    setSettings(updatedSettings);
    localStorage.setItem('userSettings', JSON.stringify(updatedSettings));
  };

  const resetSettings = () => {
    if (!isAuthenticated) return;
    
    setSettings(defaultSettings);
    localStorage.removeItem('userSettings');
  };

  return {
    settings,
    updateSettings,
    resetSettings,
    isLoading: isLoading && isAuthenticated
  };
}