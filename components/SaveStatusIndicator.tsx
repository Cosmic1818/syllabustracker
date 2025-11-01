import React from 'react';

type SaveStatus = 'idle' | 'saving' | 'saved';

interface SaveStatusIndicatorProps {
  status: SaveStatus;
}

const SaveStatusIndicator: React.FC<SaveStatusIndicatorProps> = ({ status }) => {
  const isVisible = status === 'saving' || status === 'saved';
  const message = status === 'saving' ? 'Saving...' : 'All changes saved locally';

  return (
    <div 
      className={`fixed bottom-6 left-6 z-50 py-2 px-4 rounded-lg shadow-xl glass-card transition-all duration-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}
    >
      <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
        {message}
      </p>
    </div>
  );
};

export default SaveStatusIndicator;
