import React, { useState } from 'react';
import { VaultTab } from '../../types';
import SecretNotes from './SecretNotes';
import SecretPhotos from './SecretPhotos';
import { Lock, FileText, Image, Settings, AlertTriangle } from 'lucide-react';

interface VaultDashboardProps {
  onLock: () => void;
  currentPin: string;
  onUpdatePin: (pin: string) => void;
}

const VaultDashboard: React.FC<VaultDashboardProps> = ({ onLock, currentPin, onUpdatePin }) => {
  const [activeTab, setActiveTab] = useState<VaultTab>(VaultTab.NOTES);
  const [newPinInput, setNewPinInput] = useState('');
  const [pinMessage, setPinMessage] = useState('');

  const handlePinChange = () => {
    if (newPinInput.length < 4) {
      setPinMessage('PIN must be at least 4 digits');
      return;
    }
    onUpdatePin(newPinInput);
    setPinMessage('PIN updated successfully!');
    setNewPinInput('');
    setTimeout(() => setPinMessage(''), 3000);
  };

  const renderContent = () => {
    switch (activeTab) {
      case VaultTab.NOTES:
        return <SecretNotes />;
      case VaultTab.PHOTOS:
        return <SecretPhotos />;
      case VaultTab.SETTINGS:
        return (
          <div className="p-6 bg-slate-900 text-slate-100 h-full">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Settings className="text-gray-400" /> Settings
            </h2>
            
            <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 mb-6">
              <h3 className="font-semibold mb-4 text-lg">Security</h3>
              <div className="space-y-4">
                <div>
                   <label className="block text-sm text-slate-400 mb-1">Current PIN</label>
                   <div className="text-xl font-mono tracking-widest text-slate-500">
                     {'•'.repeat(currentPin.length)}
                   </div>
                </div>
                
                <div className="pt-4 border-t border-slate-700">
                  <label className="block text-sm text-slate-300 mb-2">Change PIN</label>
                  <div className="flex gap-2">
                    <input 
                      type="number" 
                      value={newPinInput}
                      onChange={(e) => setNewPinInput(e.target.value)}
                      placeholder="New PIN"
                      className="bg-slate-900 border border-slate-600 rounded-lg p-3 text-white w-full outline-none focus:border-blue-500 transition-colors"
                    />
                    <button 
                      onClick={handlePinChange}
                      className="bg-blue-600 px-4 py-2 rounded-lg font-semibold hover:bg-blue-500"
                    >
                      Update
                    </button>
                  </div>
                  {pinMessage && <p className={`text-sm mt-2 ${pinMessage.includes('success') ? 'text-green-400' : 'text-red-400'}`}>{pinMessage}</p>}
                </div>
              </div>
            </div>

            <div className="bg-red-900/20 border border-red-900/50 p-4 rounded-xl flex items-start gap-3">
              <AlertTriangle className="text-red-500 shrink-0" />
              <div className="text-sm text-slate-300">
                <p className="font-bold text-red-400 mb-1">Warning</p>
                <p>This is a browser-based vault. Clearing your browser cache or "Local Storage" will delete all your hidden files permanently.</p>
              </div>
            </div>
          </div>
        );
      default:
        return <SecretNotes />;
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-950 text-white">
      {/* Content Area */}
      <div className="flex-1 overflow-hidden relative">
        {renderContent()}
      </div>

      {/* Bottom Navigation */}
      <div className="h-16 bg-slate-900 border-t border-slate-800 flex justify-around items-center px-2">
        <button 
          onClick={() => setActiveTab(VaultTab.NOTES)}
          className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors ${activeTab === VaultTab.NOTES ? 'text-blue-400' : 'text-slate-500 hover:text-slate-300'}`}
        >
          <FileText size={20} />
          <span className="text-[10px] font-medium">Notes</span>
        </button>
        
        <button 
          onClick={() => setActiveTab(VaultTab.PHOTOS)}
          className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors ${activeTab === VaultTab.PHOTOS ? 'text-purple-400' : 'text-slate-500 hover:text-slate-300'}`}
        >
          <Image size={20} />
          <span className="text-[10px] font-medium">Photos</span>
        </button>
        
        <button 
          onClick={() => setActiveTab(VaultTab.SETTINGS)}
          className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors ${activeTab === VaultTab.SETTINGS ? 'text-gray-100' : 'text-slate-500 hover:text-slate-300'}`}
        >
          <Settings size={20} />
          <span className="text-[10px] font-medium">Settings</span>
        </button>

        <button 
          onClick={onLock}
          className="flex flex-col items-center gap-1 p-2 rounded-lg text-red-500 hover:text-red-400 transition-colors"
        >
          <Lock size={20} />
          <span className="text-[10px] font-medium">Lock</span>
        </button>
      </div>
    </div>
  );
};

export default VaultDashboard;