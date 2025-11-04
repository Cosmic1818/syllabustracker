import React from 'react';

interface LoadingAnimationProps {
  isVisible: boolean;
}

const LoadingAnimation: React.FC<LoadingAnimationProps> = ({ isVisible }) => {
  return (
    <>
      <style>{`
        @keyframes draw {
          to {
            stroke-dashoffset: 0;
          }
        }
        @keyframes fadeIn {
          to {
            opacity: 1;
          }
        }
        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.1);
            opacity: 0.8;
          }
        }
        .anim-path {
          stroke-dasharray: 1000;
          stroke-dashoffset: 1000;
          animation: draw 1.5s ease-out forwards;
        }
        .anim-logo {
            animation: fadeIn 1s ease-in forwards;
        }
        .anim-logo-icon {
            opacity: 0;
            animation: fadeIn 0.5s ease-in 1.8s forwards, pulse 3s infinite 2.3s;
        }
      `}</style>
      <div
        className={`fixed inset-0 z-[100] flex items-center justify-center transition-opacity duration-700 ease-out ${isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        style={{ background: 'var(--bg-color-mid)' }}
        aria-hidden={!isVisible}
      >
        <div className="relative w-48 h-48 anim-logo">
            <svg 
                viewBox="0 0 200 200" 
                className="w-full h-full"
                style={{ transform: 'rotate(-90deg)' }}
            >
                {/* Growing vines/branches */}
                <path 
                    className="anim-path"
                    d="M 100 100 C 100 100 60 150 50 150 C 40 150 10 120 10 100 C 10 80 40 50 50 50 C 60 50 100 100 100 100"
                    stroke="var(--text-accent)"
                    strokeWidth="3"
                    fill="none"
                    strokeLinecap="round"
                    style={{ animationDelay: '0.2s' }}
                />
                 <path 
                    className="anim-path"
                    d="M 100 100 C 100 100 140 150 150 150 C 160 150 190 120 190 100 C 190 80 160 50 150 50 C 140 50 100 100 100 100"
                    stroke="var(--text-accent)"
                    strokeWidth="3"
                    fill="none"
                    strokeLinecap="round"
                    style={{ animationDelay: '0.4s' }}
                />
                 <path 
                    className="anim-path"
                    d="M 100 100 C 100 100 50 60 50 50 C 50 40 80 10 100 10 C 120 10 150 40 150 50 C 150 60 100 100 100 100"
                    stroke="var(--text-accent)"
                    strokeWidth="3"
                    fill="none"
                    strokeLinecap="round"
                    style={{ animationDelay: '0.6s' }}
                />
                 <path 
                    className="anim-path"
                    d="M 100 100 C 100 100 50 140 50 150 C 50 160 80 190 100 190 C 120 190 150 160 150 150 C 150 140 100 100 100 100"
                    stroke="var(--text-accent)"
                    strokeWidth="3"
                    fill="none"
                    strokeLinecap="round"
                    style={{ animationDelay: '0.8s' }}
                />

            </svg>
            {/* The app icon appears in the middle */}
            <div className="absolute inset-0 flex items-center justify-center anim-logo-icon">
                <div 
                    className="w-16 h-16 rounded-xl flex items-center justify-center shadow-lg"
                    style={{ background: 'var(--accent-gradient)' }}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" style={{color: 'var(--text-on-accent)'}} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                </div>
            </div>
        </div>
      </div>
    </>
  );
};

export default LoadingAnimation;
