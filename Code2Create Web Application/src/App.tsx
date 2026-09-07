import React, { useState, useEffect, useCallback, useMemo } from 'react';

// Icons
const Upload = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/></svg>
);
const CheckCircle2 = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>
);
const Loader2 = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
);
const AlertTriangle = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" x2="12" y1="9" y2="13"/><line x1="12" x2="12.01" y1="17" y2="17"/></svg>
);
const ShieldCheck = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/></svg>
);
const ArrowRight = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
);
const Server = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="20" height="8" x="2" y="2" rx="2" ry="2"/><rect width="20" height="8" x="2" y="14" rx="2" ry="2"/><line x1="6" x2="6.01" y1="6" y2="6"/><line x1="6" x2="6.01" y1="18" y2="18"/></svg>
);
const Layout = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><line x1="3" x2="21" y1="9" y2="9"/><line x1="9" x2="9" y1="21" y2="9"/></svg>
);
const Folder = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"/></svg>
);
const RefreshCw = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M8 16H3v5"/></svg>
);
const Copy = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
);
const ChevronDown = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m6 9 6 6 6-6"/></svg>
);
const ChevronRight = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m9 18 6-6-6-6"/></svg>
);

// Types matching Python Analysis Engine API Contract (Phase 4)
export interface Summary {
  total: number;
  matches: number;
  possible_mismatches: number;
  missing_in_backend: number;
  missing_in_frontend: number;
  has_issues: boolean;
}

export interface FieldSource {
  name: string;
  file: string;
  line: number;
}

export interface FieldResult {
  backend_field: FieldSource | null;
  frontend_field: FieldSource | null;
  status: 'match' | 'possible_mismatch' | 'missing_in_backend' | 'missing_in_frontend';
  confidence: 'confirmed' | 'probable' | 'uncertain';
  message: string;
}

export interface EndpointResult {
  endpoint: string;
  backend_fields: FieldSource[];
  frontend_fields: FieldSource[];
  results: FieldResult[];
}

export interface AnalysisResult {
  status: 'ok' | 'warning' | 'error';
  summary: Summary;
  endpoints: EndpointResult[];
  project_path?: string;
  project_name?: string;
}

// Resilient API Fetcher
async function apiFetch(endpoint: string, options?: RequestInit): Promise<Response> {
  const backendBase = (import.meta.env.VITE_BACKEND_URL || '').replace(/\/$/, '');

  if (backendBase) {
    try {
      const res = await fetch(`${backendBase}${endpoint}`, options);
      if (res.ok || res.status === 400 || res.status === 500) {
        return res;
      }
    } catch {
      // Configured backend failed; continue fallback
    }
  }

  // Try relative endpoint first (works with Vite proxy or same-host)
  try {
    const res = await fetch(endpoint, options);
    if (res.ok || res.status === 400 || res.status === 500) {
      return res;
    }
  } catch {
    // Relative request failed; fallback to direct localhost:5000
  }
  return await fetch(`http://localhost:5000${endpoint}`, options);
}

export default function App() {
  const [screen, setScreen] = useState<'upload' | 'analyzing' | 'results'>('upload');
  const [backendOnline, setBackendOnline] = useState<boolean | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [analysisTarget, setAnalysisTarget] = useState<{ type: 'path' | 'file'; value: string | File }>({
    type: 'path',
    value: 'sample_project',
  });

  // Health check on mount and interval
  const checkHealth = useCallback(async () => {
    try {
      const res = await apiFetch('/api/health');
      if (res.ok) {
        const data = await res.json();
        setBackendOnline(data.status === 'ok');
        return;
      }
    } catch {
      // ignore
    }
    setBackendOnline(false);
  }, []);

  useEffect(() => {
    checkHealth();
    const interval = setInterval(checkHealth, 6000);
    return () => clearInterval(interval);
  }, [checkHealth]);

  const startAnalysis = (target: { type: 'path' | 'file'; value: string | File }) => {
    setAnalysisTarget(target);
    setScreen('analyzing');
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans selection:bg-muted-bg selection:text-foreground">
      {/* Global Header */}
      <header className="border-b border-card-border bg-card/60 backdrop-blur-md sticky top-0 z-20">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-md bg-gradient-to-br from-primary to-muted flex items-center justify-center shadow-inner">
              <span className="font-mono font-bold text-primary-foreground text-sm">C2</span>
            </div>
            <div className="flex items-baseline gap-2">
              <h1 className="font-medium tracking-tight">Code2Create</h1>
              <span className="text-muted text-xs font-mono px-2 py-0.5 rounded bg-muted-bg border border-card-border">
                Integration
              </span>
            </div>
            <span className="text-muted text-sm hidden sm:inline-block">/ Cross-Boundary Contract Analyzer</span>
          </div>

          {/* Backend Status Indicator */}
          <div className="flex items-center gap-2">
            <button
              onClick={checkHealth}
              title="Click to re-check backend status"
              className="flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono bg-card border border-card-border hover:bg-card-hover transition-colors"
            >
              <div
                className={`w-2 h-2 rounded-full ${
                  backendOnline === true
                    ? 'bg-emerald-400 animate-pulse'
                    : backendOnline === false
                    ? 'bg-rose-500'
                    : 'bg-amber-400'
                }`}
              />
              <span className="text-muted">
                {backendOnline === true
                  ? 'Engine Online'
                  : backendOnline === false
                  ? 'Engine Offline'
                  : 'Connecting...'}
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col w-full max-w-6xl mx-auto p-6 md:p-10">
        {screen === 'upload' && (
          <UploadScreen
            backendOnline={backendOnline}
            onAnalyze={startAnalysis}
          />
        )}
        {screen === 'analyzing' && (
          <AnalyzingScreen
            target={analysisTarget}
            onSuccess={(result) => {
              setAnalysisResult(result);
              setScreen('results');
            }}
            onError={() => setScreen('upload')}
          />
        )}
        {screen === 'results' && analysisResult && (
          <ResultsScreen
            result={analysisResult}
            onReset={() => setScreen('upload')}
          />
        )}
      </main>
    </div>
  );
}

// -------------------------------------------------------------
// Screen 1: Upload / Project Selection
// -------------------------------------------------------------
function UploadScreen({
  backendOnline,
  onAnalyze,
}: {
  backendOnline: boolean | null;
  onAnalyze: (target: { type: 'path' | 'file'; value: string | File }) => void;
}) {
  const [customPath, setCustomPath] = useState('sample_project');
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setSelectedFile(file);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleRunCustomPath = () => {
    if (selectedFile) {
      onAnalyze({ type: 'file', value: selectedFile });
    } else {
      onAnalyze({ type: 'path', value: customPath.trim() || 'sample_project' });
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center max-w-3xl mx-auto w-full animate-in fade-in zoom-in-95 duration-500">
      <div className="text-center mb-8 space-y-3">
        <h2 className="text-3xl md:text-5xl font-semibold tracking-tight">
          Detect API changes that <span className="text-rose-400">break</span> your UI.
        </h2>
        <p className="text-muted text-base md:text-lg max-w-2xl mx-auto">
          Static AST analysis across Flask API endpoints and React fetch bindings to catch naming and contract drifts before runtime.
        </p>
      </div>

      {backendOnline === false && (
        <div className="w-full mb-6 p-4 rounded-xl bg-rose-950/40 border border-rose-900/60 text-rose-200 text-sm flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" />
            <div>
              <p className="font-medium">Backend Analysis Server is not running</p>
              <p className="text-xs text-rose-300/80 mt-0.5">
                Run <code className="font-mono bg-black/40 px-1 py-0.5 rounded">py backend/app.py</code> in a terminal to enable live scanning.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Main Card */}
      <div className="w-full bg-card border border-card-border rounded-xl p-8 shadow-2xl space-y-8">
        {/* Quick Demo Action */}
        <div className="p-5 rounded-xl bg-gradient-to-r from-muted-bg to-card border border-card-border/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-semibold flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" /> Ready-to-Run Demo
            </span>
            <h4 className="text-base font-semibold text-foreground mt-1">
              Bundled Sample Project (<code className="text-xs text-muted font-mono">sample_project/</code>)
            </h4>
            <p className="text-xs text-muted mt-0.5">
              Demonstrates real detection of <code className="text-amber-400 font-mono">userId</code> (backend) vs <code className="text-rose-400 font-mono">user_id</code> (frontend).
            </p>
          </div>
          <button
            onClick={() => onAnalyze({ type: 'path', value: 'sample_project' })}
            className="shrink-0 px-5 py-2.5 bg-foreground text-background font-medium text-sm rounded-lg hover:bg-neutral-200 transition-all active:scale-[0.98] flex items-center gap-2 shadow-sm"
          >
            Run Sample Scan <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Custom Project Analysis */}
        <div className="space-y-4">
          <label className="text-xs font-medium uppercase tracking-wider text-muted flex items-center gap-2">
            <Folder className="w-4 h-4" /> Or Analyze Custom Project Path
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={customPath}
              onChange={(e) => {
                setCustomPath(e.target.value);
                setSelectedFile(null);
              }}
              placeholder="e.g. sample_project or D:\my-fullstack-app"
              className="flex-1 bg-background border border-card-border rounded-lg px-4 py-2.5 text-sm font-mono text-foreground focus:outline-none focus:border-neutral-400 transition-colors"
            />
            <button
              onClick={handleRunCustomPath}
              className="px-6 py-2.5 bg-muted-bg hover:bg-card-hover border border-card-border font-medium text-sm rounded-lg transition-colors flex items-center gap-2"
            >
              Analyze Path
            </button>
          </div>
        </div>

        {/* Drag and Drop Zip */}
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragActive(true);
          }}
          onDragLeave={() => setDragActive(false)}
          onDrop={handleFileDrop}
          className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors cursor-pointer ${
            dragActive
              ? 'border-emerald-500 bg-emerald-950/10'
              : 'border-card-border hover:border-neutral-500 bg-background/50'
          }`}
          onClick={() => document.getElementById('project-zip-input')?.click()}
        >
          <Upload className="w-8 h-8 text-muted mx-auto mb-3" />
          {selectedFile ? (
            <div>
              <p className="text-sm font-medium text-emerald-400">Selected archive: {selectedFile.name}</p>
              <p className="text-xs text-muted mt-1">{(selectedFile.size / 1024).toFixed(1)} KB ready for upload</p>
            </div>
          ) : (
            <div>
              <p className="text-sm font-medium text-foreground mb-1">Upload Project ZIP Archive</p>
              <p className="text-xs text-muted">Must contain /backend and /frontend subdirectories</p>
            </div>
          )}
          <input
            id="project-zip-input"
            type="file"
            accept=".zip"
            onChange={handleFileInput}
            className="hidden"
          />
        </div>

        {selectedFile && (
          <button
            onClick={handleRunCustomPath}
            className="w-full bg-emerald-500 text-black font-semibold h-11 rounded-lg hover:bg-emerald-400 transition-colors flex items-center justify-center gap-2"
          >
            Upload & Analyze Archive <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>

      <div className="mt-8 text-center text-xs text-muted font-mono bg-muted-bg/40 px-4 py-2 rounded-full border border-card-border">
        Cross-Boundary Engine: Python AST Parser + React JSX Parser + AST Comparator
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// Screen 2: Analyzing Live Screen
// -------------------------------------------------------------
function AnalyzingScreen({
  target,
  onSuccess,
  onError,
}: {
  target: { type: 'path' | 'file'; value: string | File };
  onSuccess: (result: AnalysisResult) => void;
  onError: () => void;
}) {
  const [step, setStep] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const steps = [
    { id: 1, label: 'Connecting to Analysis Engine API', icon: Server },
    { id: 2, label: 'AST Parsing Backend Flask Endpoints', icon: Layout },
    { id: 3, label: 'AST Parsing Frontend Fetch & Prop Usage', icon: Upload },
    { id: 4, label: 'Fuzzy Matching & Contract Verification', icon: Loader2 },
  ];

  useEffect(() => {
    let isCancelled = false;

    // Simulate animated step progression
    const stepTimer = setInterval(() => {
      setStep((curr) => (curr < 3 ? curr + 1 : curr));
    }, 450);

    const executeAnalysis = async () => {
      try {
        let res: Response;
        if (target.type === 'file') {
          const formData = new FormData();
          formData.append('file', target.value as File);
          res = await apiFetch('/api/upload-and-analyze', {
            method: 'POST',
            body: formData,
          });
        } else {
          res = await apiFetch('/api/analyze', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ project_path: target.value }),
          });
        }

        const data = await res.json();
        if (!res.ok || data.error) {
          throw new Error(data.error || 'Failed to complete analysis');
        }

        if (!isCancelled) {
          setStep(4);
          setTimeout(() => onSuccess(data), 600);
        }
      } catch (err: any) {
        if (!isCancelled) {
          setErrorMessage(
            err?.message ||
              'Cannot reach analysis engine. Ensure Flask server is running at http://localhost:5000'
          );
        }
      }
    };

    executeAnalysis();

    return () => {
      isCancelled = true;
      clearInterval(stepTimer);
    };
  }, [target, onSuccess]);

  if (errorMessage) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center max-w-lg mx-auto w-full animate-in fade-in duration-300 text-center">
        <div className="w-12 h-12 rounded-full bg-rose-950/60 border border-rose-800 text-rose-400 flex items-center justify-center mb-4">
          <AlertTriangle className="w-6 h-6" />
        </div>
        <h3 className="text-xl font-semibold text-foreground mb-2">Analysis Failed</h3>
        <p className="text-sm text-muted mb-6 leading-relaxed">{errorMessage}</p>
        <div className="flex gap-3">
          <button
            onClick={onError}
            className="px-5 py-2.5 rounded-lg bg-card border border-card-border hover:bg-card-hover text-sm font-medium transition-colors"
          >
            Back to Upload
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col items-center justify-center max-w-xl mx-auto w-full animate-in fade-in duration-500">
      <div className="w-full">
        <h2 className="text-2xl md:text-3xl font-medium mb-8 flex items-center gap-3">
          <Loader2 className="w-7 h-7 animate-spin text-muted" /> Analyzing Project AST...
        </h2>

        <div className="space-y-4">
          {steps.map((s, index) => {
            const isCompleted = step > index;
            const isCurrent = step === index;

            return (
              <div
                key={s.id}
                className={`flex items-center gap-4 p-4 rounded-lg border transition-all duration-300 ${
                  isCurrent
                    ? 'bg-card border-card-border shadow-lg scale-[1.02]'
                    : isCompleted
                    ? 'border-card-border/50 opacity-80'
                    : 'border-transparent opacity-30 grayscale'
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                    isCompleted
                      ? 'bg-emerald-500 text-black'
                      : isCurrent
                      ? 'bg-muted-bg text-primary'
                      : 'bg-muted-bg text-muted'
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="w-5 h-5" />
                  ) : isCurrent ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <div className="w-2 h-2 rounded-full bg-muted" />
                  )}
                </div>
                <div className="flex-1">
                  <p className={`font-medium text-sm ${isCurrent ? 'text-primary' : ''}`}>
                    {s.label}
                  </p>
                  <p className="text-xs text-muted font-mono mt-0.5">
                    {isCompleted ? 'Complete (✓)' : isCurrent ? 'Analyzing AST...' : 'Pending'}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// Phase 5: Change Impact Map Components
// -------------------------------------------------------------
function ImpactEndpointCard({ data, hasIssues }: { data: any; hasIssues: boolean }) {
  const [expanded, setExpanded] = useState(hasIssues);

  return (
    <div className="bg-card border border-card-border rounded-xl overflow-hidden transition-all duration-200">
      {/* Header */}
      <button 
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between p-4 bg-background/50 hover:bg-card-hover transition-colors border-b border-card-border"
      >
        <div className="flex items-center gap-3">
          <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-muted-bg text-primary border border-card-border">
            ROUTE
          </span>
          <span className="font-mono text-base font-semibold text-foreground">
            {data.endpoint}
          </span>
        </div>
        <div className="flex items-center gap-4">
          {hasIssues && (
             <span className="text-xs font-semibold text-amber-400 bg-amber-400/10 px-2 py-1 rounded-md border border-amber-400/20">
               Has Issues
             </span>
          )}
          <span className="text-muted">
            {expanded ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
          </span>
        </div>
      </button>

      {/* Body */}
      {expanded && (
        <div className="p-4 space-y-6 bg-card">
          {data.backendFields.length === 0 && data.frontendOnlyFields.length === 0 && (
            <p className="text-sm text-muted">No fields detected for this endpoint.</p>
          )}

          {/* Backend Fields and their Frontend Usages */}
          {data.backendFields.map((bf: any, i: number) => (
            <div key={i} className="border border-card-border rounded-lg bg-background/30 overflow-hidden">
              <div className="p-3 bg-muted-bg/50 border-b border-card-border flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-primary font-mono font-bold text-sm">{bf.source.name}</span>
                    <span className="text-[10px] text-muted font-mono bg-card border border-card-border px-1.5 py-0.5 rounded">
                      {bf.source.file} : {bf.source.line}
                    </span>
                  </div>
                  <p className="text-xs text-muted mt-1">
                    {bf.frontendUsages.length} frontend usage(s)
                  </p>
                </div>
              </div>
              
              <div className="p-3">
                {bf.frontendUsages.length === 0 ? (
                  <div className="flex items-center gap-2 text-sm text-amber-400 bg-amber-400/10 px-3 py-2 rounded-md border border-amber-400/20">
                    <AlertTriangle className="w-4 h-4" />
                    No frontend usage detected
                  </div>
                ) : (
                  <div className="space-y-3 relative before:absolute before:inset-y-0 before:left-[11px] before:w-[1px] before:bg-card-border ml-2">
                    {bf.frontendUsages.map((usage: any, j: number) => {
                      const ff = usage.frontend_field;
                      const isMatch = usage.status === 'match';
                      const isConfirmed = usage.confidence === 'confirmed';
                      
                      return (
                        <div key={j} className="relative pl-8">
                          <div className="absolute left-[-11px] top-3 w-6 h-[1px] bg-card-border" />
                          <div className={`p-3 rounded-md border ${isMatch ? 'bg-emerald-400/5 border-emerald-400/20' : 'bg-amber-400/5 border-amber-400/20'}`}>
                            <div className="flex items-start justify-between">
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className={`font-mono font-bold text-sm ${isMatch ? 'text-emerald-400' : 'text-amber-400'}`}>
                                    {ff.name}
                                  </span>
                                  <span className="text-[10px] text-muted font-mono bg-card border border-card-border px-1.5 py-0.5 rounded">
                                    {ff.file} : {ff.line}
                                  </span>
                                </div>
                                <div className="mt-2 flex items-center gap-2">
                                  <span className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded ${isMatch ? 'bg-emerald-400/10 text-emerald-400' : 'bg-amber-400/10 text-amber-400'}`}>
                                    {usage.status.replace(/_/g, ' ')}
                                  </span>
                                  <span className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded ${isConfirmed ? 'bg-primary/20 text-primary border border-primary/20' : 'bg-muted-bg text-muted border border-card-border'}`}>
                                    {usage.confidence}
                                  </span>
                                </div>
                                {!isConfirmed && (
                                  <p className="text-[11px] text-muted mt-2 border-t border-card-border pt-2">
                                    Potential relationship. Field usage detected, but no explicit request to this endpoint was found in the same frontend file.
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Frontend Only Fields */}
          {data.frontendOnlyFields.length > 0 && (
            <div className="border border-card-border rounded-lg bg-background/30 overflow-hidden mt-6">
               <div className="p-3 bg-muted-bg/50 border-b border-card-border flex items-start justify-between">
                <div>
                  <h4 className="text-amber-400 font-semibold text-sm">Frontend-only fields</h4>
                  <p className="text-xs text-muted mt-1">
                    No matching backend field detected for these usages
                  </p>
                </div>
              </div>
              <div className="p-3 space-y-3 relative before:absolute before:inset-y-0 before:left-[11px] before:w-[1px] before:bg-card-border ml-2">
                {data.frontendOnlyFields.map((usage: any, j: number) => {
                  const ff = usage.frontend_field;
                  const isConfirmed = usage.confidence === 'confirmed';
                  return (
                    <div key={j} className="relative pl-8">
                      <div className="absolute left-[-11px] top-3 w-6 h-[1px] bg-card-border" />
                      <div className="p-3 rounded-md border bg-amber-400/5 border-amber-400/20">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-sm text-amber-400">
                            {ff.name}
                          </span>
                          <span className="text-[10px] text-muted font-mono bg-card border border-card-border px-1.5 py-0.5 rounded">
                            {ff.file} : {ff.line}
                          </span>
                        </div>
                        <div className="mt-2 flex items-center gap-2">
                          <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-amber-400/10 text-amber-400">
                            {usage.status.replace(/_/g, ' ')}
                          </span>
                          <span className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded ${isConfirmed ? 'bg-primary/20 text-primary border border-primary/20' : 'bg-muted-bg text-muted border border-card-border'}`}>
                            {usage.confidence}
                          </span>
                        </div>
                        {!isConfirmed && (
                          <p className="text-[11px] text-muted mt-2 border-t border-card-border pt-2">
                            Potential relationship. Field usage detected, but no explicit request to this endpoint was found in the same frontend file.
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// -------------------------------------------------------------
// Screen 3: Results Screen
// -------------------------------------------------------------
function ResultsScreen({
  result,
  onReset,
}: {
  result: AnalysisResult;
  onReset: () => void;
}) {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'issues' | 'impact_map'>('issues');
  const { summary, endpoints } = result;

  // Grouped Impact Map Data for Phase 5
  const impactMapData = useMemo(() => {
    return endpoints.map((ep) => {
      const backendFieldsMap: Record<string, { source: FieldSource; frontendUsages: FieldResult[] }> = {};
      const frontendOnlyFields: FieldResult[] = [];

      ep.results.forEach((r) => {
        // Case 4: both null
        if (!r.backend_field && !r.frontend_field) return;

        // Case 1 & 2: backend_field !== null
        if (r.backend_field) {
          const key = r.backend_field.name;
          if (!backendFieldsMap[key]) {
            backendFieldsMap[key] = {
              source: r.backend_field,
              frontendUsages: [],
            };
          }
          if (r.frontend_field) {
            backendFieldsMap[key].frontendUsages.push(r);
          }
        } 
        // Case 3: backend_field === null && frontend_field !== null
        else if (r.frontend_field) {
          frontendOnlyFields.push(r);
        }
      });

      return {
        endpoint: ep.endpoint,
        backendFields: Object.values(backendFieldsMap),
        frontendOnlyFields,
      };
    });
  }, [endpoints]);

  const copyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(result, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Collect all possible mismatches across endpoints
  const allMismatches: { endpoint: string; result: FieldResult }[] = [];
  endpoints.forEach((ep) => {
    ep.results
      .filter((r) => r.status === 'possible_mismatch')
      .forEach((r) => allMismatches.push({ endpoint: ep.endpoint, result: r }));
  });

  // Collect missing fields
  const allMissing: { endpoint: string; result: FieldResult }[] = [];
  endpoints.forEach((ep) => {
    ep.results
      .filter((r) => r.status === 'missing_in_backend' || r.status === 'missing_in_frontend')
      .forEach((r) => allMissing.push({ endpoint: ep.endpoint, result: r }));
  });

  return (
    <div className="w-full max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-6 duration-600 space-y-8">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-card-border pb-6">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-3xl font-semibold tracking-tight">Analysis Results</h2>
            <span
              className={`text-xs font-mono uppercase px-2.5 py-1 rounded-full font-bold border ${
                summary.has_issues
                  ? 'bg-amber-950/60 text-amber-300 border-amber-800'
                  : 'bg-emerald-950/60 text-emerald-300 border-emerald-800'
              }`}
            >
              {summary.has_issues ? '⚠ Issues Detected' : '✓ Verified Clean'}
            </span>
          </div>
          <p className="text-muted mt-2 font-mono text-xs">
            Target: {result.project_name || result.project_path || 'sample_project'} • {endpoints.length} endpoint(s) inspected
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={copyJson}
            className="px-3.5 py-2 bg-card border border-card-border rounded-md text-xs font-medium hover:bg-card-hover transition-colors flex items-center gap-1.5"
          >
            <Copy className="w-3.5 h-3.5" />
            {copied ? 'Copied!' : 'Copy JSON'}
          </button>
          <button
            onClick={onReset}
            className="px-4 py-2 bg-foreground text-background font-semibold rounded-md text-xs hover:bg-neutral-200 transition-colors flex items-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" /> New Scan
          </button>
        </div>
      </div>

      {/* Tab Switcher */}
      <div className="flex items-center gap-2 border-b border-card-border pb-2">
        <button
          onClick={() => setActiveTab('issues')}
          className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors ${
            activeTab === 'issues' ? 'bg-card border border-card-border text-foreground' : 'text-muted hover:text-foreground'
          }`}
        >
          Issues Dashboard
        </button>
        <button
          onClick={() => setActiveTab('impact_map')}
          className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors ${
            activeTab === 'impact_map' ? 'bg-card border border-card-border text-foreground' : 'text-muted hover:text-foreground'
          }`}
        >
          Change Impact Map
        </button>
      </div>

      {activeTab === 'issues' && (
        <div className="space-y-8 animate-in fade-in duration-300">
          {/* Summary Stat Grid */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-card border border-card-border rounded-xl p-4">
          <p className="text-xs font-mono text-muted uppercase">Total Evaluated</p>
          <p className="text-2xl font-bold mt-1 text-foreground">{summary.total}</p>
        </div>
        <div className="bg-card border border-card-border rounded-xl p-4">
          <p className="text-xs font-mono text-muted uppercase">Exact Matches</p>
          <p className="text-2xl font-bold mt-1 text-emerald-400">{summary.matches}</p>
        </div>
        <div className="bg-card border border-card-border rounded-xl p-4">
          <p className="text-xs font-mono text-muted uppercase">Possible Mismatches</p>
          <p className="text-2xl font-bold mt-1 text-amber-400">{summary.possible_mismatches}</p>
        </div>
        <div className="bg-card border border-card-border rounded-xl p-4">
          <p className="text-xs font-mono text-muted uppercase">Missing in Backend</p>
          <p className="text-2xl font-bold mt-1 text-rose-400">{summary.missing_in_backend}</p>
        </div>
        <div className="bg-card border border-card-border rounded-xl p-4">
          <p className="text-xs font-mono text-muted uppercase">Missing in Frontend</p>
          <p className="text-2xl font-bold mt-1 text-neutral-400">{summary.missing_in_frontend}</p>
        </div>
      </div>

      {/* Issue Highlight Banner */}
      {summary.has_issues ? (
        <div className="bg-amber-950/40 border border-amber-900/60 rounded-xl p-4 flex items-start gap-4">
          <AlertTriangle className="w-6 h-6 text-amber-400 mt-1 shrink-0" />
          <div>
            <h3 className="text-base font-semibold text-amber-300">
              Contract Discrepancies Found Across Boundary
            </h3>
            <p className="text-xs md:text-sm text-foreground/80 mt-1 leading-relaxed">
              We identified naming mismatches and unused/missing fields between Flask responses and React frontend consumption.
            </p>
          </div>
        </div>
      ) : (
        <div className="bg-emerald-950/30 border border-emerald-900/60 rounded-xl p-4 flex items-center gap-3">
          <ShieldCheck className="w-6 h-6 text-emerald-400 shrink-0" />
          <div>
            <h3 className="text-base font-semibold text-emerald-300">All Field Contracts Verified</h3>
            <p className="text-xs text-foreground/80">Every backend API response perfectly matches frontend usage.</p>
          </div>
        </div>
      )}

      {/* Detected Mismatches Breakdown */}
      {allMismatches.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-muted font-mono">
            Naming Mismatches (Potential Breaking Changes)
          </h3>
          {allMismatches.map((item, idx) => (
            <div
              key={idx}
              className="bg-card border border-card-border rounded-xl overflow-hidden shadow-lg group"
            >
              <div className="px-6 py-3.5 border-b border-card-border flex items-center justify-between bg-card-hover/40">
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded bg-amber-950 border border-amber-800 text-amber-400 text-xs font-bold flex items-center justify-center">
                    {idx + 1}
                  </span>
                  <span className="font-mono text-xs text-foreground font-semibold">
                    {item.endpoint}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {item.result.confidence && (
                    <span className={`text-xs font-mono px-2 py-0.5 rounded-full border ${
                      item.result.confidence === 'confirmed'
                        ? 'bg-emerald-950/60 text-emerald-400 border-emerald-800'
                        : item.result.confidence === 'probable'
                        ? 'bg-blue-950/60 text-blue-400 border-blue-800'
                        : 'bg-neutral-800/60 text-neutral-400 border-neutral-700'
                    }`}>
                      {item.result.confidence}
                    </span>
                  )}
                  <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-muted-bg text-amber-400 border border-card-border flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                    Possible Mismatch
                  </span>
                </div>
              </div>

              <div className="p-6 md:p-8 grid md:grid-cols-[1fr_auto_1fr] gap-6 items-center">
                {/* Backend Side */}
                <div className="space-y-2">
                  <div className="text-xs font-medium text-muted uppercase tracking-wider flex items-center gap-2">
                    <Server className="w-4 h-4" /> Backend Output
                  </div>
                  <div className="bg-background rounded-lg p-4 border border-card-border group-hover:border-amber-500/40 transition-colors">
                    <div className="text-xs text-muted mb-2 font-mono">Flask Route Dict Key</div>
                    <div className="font-mono text-xl text-amber-400 font-semibold bg-muted-bg/60 inline-block px-3 py-1.5 rounded">
                      {item.result.backend_field?.name ?? '—'}
                    </div>
                    {item.result.backend_field?.file && (
                      <div className="text-[10px] text-muted font-mono mt-1.5 opacity-70">
                        {item.result.backend_field.file} : {item.result.backend_field.line}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex justify-center md:rotate-0 rotate-90 text-muted">
                  <ArrowRight className="w-8 h-8 opacity-25" />
                </div>

                {/* Frontend Side */}
                <div className="space-y-2">
                  <div className="text-xs font-medium text-muted uppercase tracking-wider flex items-center gap-2">
                    <Layout className="w-4 h-4" /> Frontend Expectation
                  </div>
                  <div className="bg-background rounded-lg p-4 border border-card-border group-hover:border-rose-500/40 transition-colors">
                    <div className="text-xs text-muted mb-2 font-mono">React Component Prop Access</div>
                    <div className="font-mono text-xl text-rose-400 font-semibold bg-muted-bg/60 inline-block px-3 py-1.5 rounded border-b border-dashed border-rose-500/60">
                      {item.result.frontend_field?.name ?? '—'}
                    </div>
                    {item.result.frontend_field?.file && (
                      <div className="text-[10px] text-muted font-mono mt-1.5 opacity-70">
                        {item.result.frontend_field.file} : {item.result.frontend_field.line}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="bg-muted-bg/30 px-6 py-3 text-xs text-muted border-t border-card-border">
                <strong>Fix Recommendation:</strong> Standardize on camelCase{' '}
                <code className="font-mono text-xs bg-muted-bg px-1 rounded text-foreground">
                  {item.result.backend_field?.name ?? '—'}
                </code>{' '}
                or snake_case{' '}
                <code className="font-mono text-xs bg-muted-bg px-1 rounded text-foreground">
                  {item.result.frontend_field?.name ?? '—'}
                </code>{' '}
                across the API boundary to prevent undefined UI state.
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Endpoints Detailed View */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-muted font-mono">
          Endpoint Breakdown ({endpoints.length})
        </h3>
        {endpoints.map((ep, epIdx) => {
          const epMatches = ep.results.filter((r) => r.status === 'match');
          const epMismatches = ep.results.filter((r) => r.status === 'possible_mismatch');
          const epMissing = ep.results.filter(
            (r) => r.status === 'missing_in_backend' || r.status === 'missing_in_frontend'
          );

          return (
            <div
              key={epIdx}
              className="bg-card border border-card-border rounded-xl p-6 space-y-4"
            >
              <div className="flex items-center justify-between border-b border-card-border pb-3">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-muted-bg text-primary border border-card-border">
                    ROUTE
                  </span>
                  <span className="font-mono text-sm font-semibold text-foreground">
                    {ep.endpoint}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs font-mono text-muted">
                  <span>{epMatches.length} match</span> •
                  <span className="text-amber-400">{epMismatches.length} mismatch</span> •
                  <span className="text-rose-400">{epMissing.length} missing</span>
                </div>
              </div>

              {/* Matched Fields List */}
              {epMatches.length > 0 && (
                <div className="bg-background/60 rounded-lg p-3 border border-card-border/60 flex items-center justify-between text-xs font-mono">
                  <span className="text-emerald-400 flex items-center gap-1.5 font-semibold">
                    <CheckCircle2 className="w-4 h-4" /> Matched Fields:
                  </span>
                  <div className="flex gap-2 flex-wrap">
                    {epMatches.map((m, mIdx) => (
                      <span
                        key={mIdx}
                        className="px-2 py-0.5 rounded bg-muted-bg text-foreground border border-card-border"
                      >
                        {m.backend_field?.name ?? m.frontend_field?.name ?? '—'}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Missing Fields Details */}
              {epMissing.length > 0 && (
                <div className="space-y-2">
                  {epMissing.map((miss, missIdx) => (
                    <div
                      key={missIdx}
                      className="p-3 rounded-lg bg-background/40 border border-card-border text-xs font-mono flex items-center justify-between"
                    >
                      <span
                        className={
                          miss.status === 'missing_in_backend' ? 'text-rose-400' : 'text-neutral-400'
                        }
                      >
                        {miss.message}
                      </span>
                      <span className="text-muted text-[10px] uppercase">
                        {miss.status.replace(/_/g, ' ')}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
        </div>
      )}

      {activeTab === 'impact_map' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="bg-card border border-card-border rounded-xl p-6 mb-6">
            <h3 className="text-xl font-semibold mb-2 text-foreground">Change Impact Map</h3>
            <p className="text-muted text-sm">
              Visualize how backend response fields map to specific frontend usages. 
              Review the confidence levels to understand where the dependency is explicitly proven versus inferred.
            </p>
          </div>

          <div className="space-y-4">
            {impactMapData.map((data, idx) => {
              // Determine if this endpoint has any mismatches or missing fields
              const ep = endpoints.find(e => e.endpoint === data.endpoint);
              const hasIssues = ep ? ep.results.some(r => r.status !== 'match') : false;
              
              return (
                <ImpactEndpointCard key={idx} data={data} hasIssues={hasIssues} />
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
