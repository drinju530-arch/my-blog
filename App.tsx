import React, { useState, useEffect } from 'react';
import Calculator from './components/Calculator';
import VaultDashboard from './components/Vault/VaultDashboard';
import { VaultSettings } from './types';

// Key for storing the PIN in local storage
const SETTINGS_KEY = 'calcvault_settings';

const App: React.FC = () => {
  const [isLocked, setIsLocked] = useState<boolean>(true);
  const [settings, setSettings] = useState<VaultSettings>({
    pin: '1234', // Default PIN
    isSetup: false,
  });

  useEffect(() => {
    const storedSettings = localStorage.getItem(SETTINGS_KEY);
    if (storedSettings) {
      setSettings(JSON.parse(storedSettings));
    } else {
      // Initialize with default if not found
      localStorage.setItem(SETTINGS_KEY, JSON.stringify({ pin: '1234', isSetup: false }));
    }
  }, []);

  const handleUnlock = () => {
    setIsLocked(false);
  };

  const handleLock = () => {
    setIsLocked(true);
  };

  const updatePin = (newPin: string) => {
    const newSettings = { ...settings, pin: newPin, isSetup: true };
    setSettings(newSettings);
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(newSettings));
  };

  return (
    <div className="w-full h-full max-w-md mx-auto bg-black overflow-hidden shadow-2xl relative">
      {isLocked ? (
        <Calculator 
          pin={settings.pin} 
          onUnlock={handleUnlock} 
          isFirstTime={!settings.isSetup}
        />
      ) : (
        <VaultDashboard 
          onLock={handleLock} 
          currentPin={settings.pin} 
          onUpdatePin={updatePin} 
        />
      )}
    </div>
  );
};

export default App;