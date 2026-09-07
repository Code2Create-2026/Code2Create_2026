import React, { useState, useEffect } from 'react';
import { Box, Sun, Moon, CheckCircle2, AlertTriangle, XCircle } from 'lucide-react';
import { UploadScreen } from './components/UploadScreen';
import { AnalysisProgress } from './components/AnalysisProgress';
import { Dashboard } from './components/Dashboard';
import { analyzeProject } from './services/api';
import { AnalysisResponse, Status } from './types/analysis';

const StatusPill = ({ status }: { status: Status | null }) => {
  if (!status) return null;
  
  const config = {
    ok: { icon: CheckCircle2, class: 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20' },
    warning: { icon: AlertTriangle, class: 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20' },
    error: { icon: XCircle, class: 'bg-rose-100 text-rose-700 border-rose-200 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20' }
  }[status];

  const Icon = config.icon;
  return (
    <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-semibold uppercase tracking-wider transition-colors shadow-sm ${config.class}`}>
      <Icon className="w-3.5 h-3.5" />
      <span>{status}</span>
    </div>
  );
};

export default function App() {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [appState, setAppState] = useState<'upload' | 'analyzing' | 'results'>('upload');
  const [data, setData] = useState<AnalysisResponse | null>(null);

  // Setup theme
  useEffect(() => {
    if (isDarkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [isDarkMode]);

  // Keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/' && document.activeElement?.tagName !== 'INPUT') {
        e.preventDefault();
        document.querySelector('input')?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleAnalyze = async (file?: File, samplePath?: string) => {
    setAppState('analyzing');
    setData(null);
    const result = await analyzeProject(file, samplePath);
    setData(result);
    setAppState('results');
  };

  const handleReset = () => {
    setData(null);
    setAppState('upload');
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] dark:bg-[#201c1a] text-stone-900 dark:text-stone-50 selection:bg-orange-500/30 font-sans pb-24 transition-colors duration-300">
      
      {/* Global Header */}
      <header className="sticky top-0 z-50 bg-[#FDFBF7]/80 dark:bg-[#201c1a]/80 backdrop-blur-md border-b border-stone-200 dark:border-stone-800 transition-colors">
        <div className="max-w-[1400px] mx-auto px-6 h-14 flex items-center justify-between">
          
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded bg-orange-100 border-orange-200 dark:bg-orange-500/10 border dark:border-orange-500/20 flex items-center justify-center transition-colors">
              <Box className="w-4 h-4 text-orange-600 dark:text-orange-400" />
            </div>
            <h1 className="font-semibold tracking-tight text-stone-800 dark:text-stone-100 text-sm">
              Code2Create <span className="text-stone-500 dark:text-stone-500 font-normal">Analysis Engine</span>
            </h1>
          </div>
          
          <div className="flex items-center gap-4">
            {appState === 'results' && <StatusPill status={data?.status || null} />}
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-1.5 rounded-md hover:bg-stone-200/50 dark:hover:bg-stone-800/50 text-stone-500 dark:text-stone-400 transition-colors"
              aria-label="Toggle Dark Mode"
            >
              {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </header>

      {/* Main Workspace */}
      <main className="max-w-[1400px] mx-auto px-6 pt-10">
        {appState === 'upload' && <UploadScreen onAnalyze={handleAnalyze} />}
        {appState === 'analyzing' && <AnalysisProgress />}
        {appState === 'results' && data && <Dashboard data={data} onReset={handleReset} />}
      </main>
    </div>
  );
}
