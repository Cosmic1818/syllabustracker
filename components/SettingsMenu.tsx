import React, { useState } from 'react';
import { playClickSound } from '../utils/sound';

interface SettingsMenuProps {
  onExport: () => void;
  onImport: () => void;
}

const SettingsMenu: React.FC<SettingsMenuProps> = ({ onExport, onImport }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    playClickSound();
    setIsOpen(!isOpen);
  };
  
  const handleExportClick = () => {
    playClickSound();
    onExport();
    setIsOpen(false);
  };

  const handleImportClick = () => {
    // Sound is played in App.tsx when file dialog opens
    onImport();
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={toggleMenu}
        className="w-10 h-10 rounded-full flex items-center justify-center border transition-colors"
        style={{ 
            backgroundColor: 'var(--card-bg)', 
            borderColor: 'var(--card-border)'
        }}
        aria-label="Open settings"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" style={{ color: 'var(--text-secondary)' }} viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.96.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
        </svg>
      </button>

      {isOpen && (
        <div 
            className="absolute right-0 mt-2 w-56 p-2 glass-card z-50 origin-top-right animate-in fade-in-0 zoom-in-95"
            onMouseLeave={() => setIsOpen(false)}
        >
          <div className="space-y-1">
            <button
              onClick={handleExportClick}
              className="w-full text-left px-3 py-2 text-sm rounded-lg flex items-center gap-3 transition-colors hover:bg-[var(--card-hover-bg)]"
              style={{ color: 'var(--text-primary)'}}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
              Export Backup
            </button>
            <button
              onClick={handleImportClick}
              className="w-full text-left px-3 py-2 text-sm rounded-lg flex items-center gap-3 transition-colors hover:bg-[var(--card-hover-bg)]"
              style={{ color: 'var(--text-primary)'}}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 7.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 6.414V13a1 1 0 11-2 0V6.414L7.707 7.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
              Import Backup
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsMenu;