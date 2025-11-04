
import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import Header from './components/Header';
import SyllabusView from './components/SyllabusView';
import SubjectDetail from './components/SubjectDetail';
import { SYLLABUS_DATA } from './constants';
import { Subject, BackupData } from './types';
import { THEMES } from './themes';
import SaveStatusIndicator from './components/SaveStatusIndicator';
import { playClickSound } from './utils/sound';
import LoadingAnimation from './components/LoadingAnimation';

const SYLLABUS_STORAGE_KEY = 'gateCseSyllabusProgress';
const THEME_STORAGE_KEY = 'gateCseTheme';

type SaveStatus = 'idle' | 'saving' | 'saved';

const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [syllabusData, setSyllabusData] = useState<Subject[]>(() => {
    try {
      const savedData = localStorage.getItem(SYLLABUS_STORAGE_KEY);
      return savedData ? JSON.parse(savedData) : SYLLABUS_DATA;
    } catch (error) {
      console.error("Error loading syllabus data from localStorage", error);
      return SYLLABUS_DATA;
    }
  });
  
  const [activeTheme, setActiveTheme] = useState<string>(() => {
    return localStorage.getItem(THEME_STORAGE_KEY) || 'vedicScripture';
  });

  const [selectedSubjectId, setSelectedSubjectId] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');

  const saveTimeoutRef = useRef<number | null>(null);
  const isInitialMount = useRef(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Effect for loading animation
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2800); // Duration of the animation
    return () => clearTimeout(timer);
  }, []);

  // Effect to save syllabus progress
  useEffect(() => {
    if (isInitialMount.current) {
        isInitialMount.current = false;
        return;
    }

    if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
    }

    setSaveStatus('saving');

    const saveTimer = setTimeout(() => {
        try {
            localStorage.setItem(SYLLABUS_STORAGE_KEY, JSON.stringify(syllabusData));
            setSaveStatus('saved');
            saveTimeoutRef.current = window.setTimeout(() => {
                setSaveStatus('idle');
            }, 2000);
        } catch (error) {
            console.error("Error saving syllabus data to localStorage", error);
            setSaveStatus('idle');
        }
    }, 500);

    return () => {
        clearTimeout(saveTimer);
        if (saveTimeoutRef.current) {
            clearTimeout(saveTimeoutRef.current);
        }
    };
  }, [syllabusData]);
  
  // Effect to apply and save theme
  useEffect(() => {
    localStorage.setItem(THEME_STORAGE_KEY, activeTheme);
    const theme = THEMES.find(t => t.id === activeTheme);
    if (theme) {
      Object.entries(theme.colors).forEach(([key, value]) => {
        document.documentElement.style.setProperty(key, value);
      });
    }
  }, [activeTheme]);

  const handleToggleTopic = useCallback((subjectId: string, topicId: string) => {
    setSyllabusData(prevData =>
      prevData.map(subject => {
        if (subject.id === subjectId) {
          return {
            ...subject,
            topics: subject.topics.map(topic => {
              if (topic.id === topicId) {
                const isCompleted = !topic.completed;
                return { 
                  ...topic, 
                  completed: isCompleted,
                  completionDate: isCompleted ? Date.now() : undefined,
                };
              }
              return topic;
            }),
          };
        }
        return subject;
      })
    );
  }, []);

  const handleSelectSubject = useCallback((subjectId: string) => {
    setSelectedSubjectId(subjectId);
  }, []);

  const handleBack = useCallback(() => {
    setSelectedSubjectId(null);
  }, []);

  const handleExport = useCallback(() => {
    const backupData: BackupData = {
        syllabusData,
        activeTheme,
    };
    const dataStr = JSON.stringify(backupData, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const date = new Date().toISOString().slice(0, 10);
    link.download = `gate-cse-tracker-backup-${date}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, [syllabusData, activeTheme]);

  const handleImportClick = useCallback(() => {
    playClickSound();
    fileInputRef.current?.click();
  }, []);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const text = e.target?.result as string;
            const importedData: BackupData = JSON.parse(text);
            
            if (importedData.syllabusData && importedData.activeTheme && Array.isArray(importedData.syllabusData)) {
                 if (window.confirm('Are you sure you want to import this data? This will overwrite your current progress.')) {
                    setSyllabusData(importedData.syllabusData);
                    setActiveTheme(importedData.activeTheme);
                    setSelectedSubjectId(null); 
                 }
            } else {
                alert('Invalid backup file format.');
            }
        } catch (error) {
            console.error("Error parsing backup file", error);
            alert('Could not read the backup file. It might be corrupted.');
        } finally {
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };
    reader.readAsText(file);
  };

  const selectedSubject = useMemo(() => {
    return syllabusData.find(s => s.id === selectedSubjectId) || null;
  }, [selectedSubjectId, syllabusData]);

  return (
    <>
      <LoadingAnimation isVisible={isLoading} />
      <div className={`min-h-screen font-sans transition-opacity duration-700 ease-in ${isLoading ? 'opacity-0' : 'opacity-100'}`}>
        <Header 
          activeTheme={activeTheme} 
          setActiveTheme={setActiveTheme} 
          onExport={handleExport}
          onImport={handleImportClick}
        />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {selectedSubject ? (
            <SubjectDetail
              subject={selectedSubject}
              onToggleTopic={handleToggleTopic}
              onBack={handleBack}
            />
          ) : (
            <SyllabusView
              syllabusData={syllabusData}
              onSelectSubject={handleSelectSubject}
            />
          )}
        </main>
        <SaveStatusIndicator status={saveStatus} />
        <footer className="text-center py-6 text-sm" style={{ color: 'var(--text-secondary)' }}>
          <p>Built for GATE CSE Aspirants with a futuristic touch.</p>
        </footer>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="application/json"
          style={{ display: 'none' }}
        />
      </div>
    </>
  );
};

export default App;
