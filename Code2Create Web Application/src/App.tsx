import React, { useState, useEffect } from 'react';

// Simple SVG Icons
const Upload = ({ className }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/></svg>;
const ChevronDown = ({ className }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polyline points="6 9 12 15 18 9"/></svg>;
const CheckCircle2 = ({ className }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>;
const Loader2 = ({ className }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>;
const AlertTriangle = ({ className }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" x2="12" y1="9" y2="13"/><line x1="12" x2="12.01" y1="17" y2="17"/></svg>;
const ShieldCheck = ({ className }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/></svg>;
const ArrowRight = ({ className }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>;
const Server = ({ className }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="20" height="8" x="2" y="2" rx="2" ry="2"/><rect width="20" height="8" x="2" y="14" rx="2" ry="2"/><line x1="6" x2="6.01" y1="6" y2="6"/><line x1="6" x2="6.01" y1="18" y2="18"/></svg>;
const Layout = ({ className }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><line x1="3" x2="21" y1="9" y2="9"/><line x1="9" x2="9" y1="21" y2="9"/></svg>;

export default function App() {
  const [screen, setScreen] = useState<'upload' | 'analyzing' | 'results'>('upload');

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans selection:bg-muted-bg selection:text-foreground">
      {/* Global Header */}
      <header className="border-b border-card-border bg-card/50 backdrop-blur-md sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center gap-3">
          <div className="w-8 h-8 rounded-md bg-gradient-to-br from-primary to-muted flex items-center justify-center shadow-inner">
            <span className="font-mono font-bold text-primary-foreground text-sm">C2</span>
          </div>
          <h1 className="font-medium tracking-tight">Code2Create</h1>
          <span className="text-muted ml-2 text-sm hidden sm:inline-block">/ Cross-Boundary Dependency Analyzer</span>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col w-full max-w-5xl mx-auto p-6 md:p-12">
        {screen === 'upload' && <UploadScreen onAnalyze={() => setScreen('analyzing')} />}
        {screen === 'analyzing' && <AnalyzingScreen onComplete={() => setScreen('results')} />}
        {screen === 'results' && <ResultsScreen onReset={() => setScreen('upload')} />}
      </main>
    </div>
  );
}

function UploadScreen({ onAnalyze }: { onAnalyze: () => void }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center max-w-2xl mx-auto w-full animate-in fade-in zoom-in-95 duration-500">
      <div className="text-center mb-10 space-y-4">
        <h2 className="text-4xl md:text-5xl font-semibold tracking-tighter">
          Detect API changes that could <span className="text-muted line-through decoration-muted">break</span> your UI.
        </h2>
        <p className="text-muted text-lg max-w-xl mx-auto">
          Scan your backend and frontend code to detect data contract mismatches before they hit production.
        </p>
      </div>

      <div className="w-full bg-card border border-card-border rounded-xl p-8 shadow-2xl relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        
        <div className="relative">
          <h3 className="text-xl font-medium mb-6 flex items-center gap-2">
            <Upload className="w-5 h-5 text-muted" /> Analyze Your Project
          </h3>
          
          <div className="space-y-6">
            <div className="pt-4">
              <div className="border-2 border-dashed border-card-border rounded-xl p-8 text-center hover:border-primary/50 transition-colors cursor-pointer bg-background/50">
                <Upload className="w-8 h-8 text-muted mx-auto mb-3" />
                <p className="text-sm font-medium text-foreground mb-1">Click to upload or drag and drop</p>
                <p className="text-xs text-muted">ZIP, TAR.GZ or Project Folder</p>
                <input type="file" className="hidden" />
              </div>
            </div>

            <div className="pt-4">
              <button 
                onClick={onAnalyze}
                className="w-full bg-primary text-primary-foreground h-12 rounded-lg font-medium hover:bg-primary/90 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
              >
                [ Analyze ] <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-12 text-center text-sm text-muted font-mono bg-muted-bg/50 px-4 py-2 rounded-full border border-card-border">
        Ready to scan 14,203 lines of code across 2 environments.
      </div>
    </div>
  );
}

function AnalyzingScreen({ onComplete }: { onComplete: () => void }) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setStep((s) => {
        if (s >= 3) {
          clearInterval(timer);
          setTimeout(onComplete, 800);
          return s;
        }
        return s + 1;
      });
    }, 1200);
    return () => clearInterval(timer);
  }, [onComplete]);

  const steps = [
    { id: 1, label: 'Scanning Backend APIs', icon: Server },
    { id: 2, label: 'Analyzing Frontend Data Fetching', icon: Layout },
    { id: 3, label: 'Resolving Cross-Boundary Dependencies', icon: Upload },
    { id: 4, label: 'Comparing ASTs for Mismatches', icon: Loader2 }
  ];

  return (
    <div className="flex-1 flex flex-col items-center justify-center max-w-xl mx-auto w-full animate-in fade-in duration-500">
      <div className="w-full">
        <h2 className="text-3xl font-medium mb-8 flex items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-muted" /> Analyzing Project...
        </h2>

        <div className="space-y-4">
          {steps.map((s, index) => {
            const Icon = s.icon;
            const isCompleted = step > index;
            const isCurrent = step === index;
            const isPending = step < index;
            
            return (
              <div 
                key={s.id} 
                className={`flex items-center gap-4 p-4 rounded-lg border transition-all duration-300 ${
                  isCurrent ? 'bg-card border-card-border shadow-lg scale-[1.02]' : 
                  isCompleted ? 'border-transparent opacity-60' : 
                  'border-transparent opacity-30 grayscale'
                }`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                  isCompleted ? 'bg-success text-foreground' : 
                  isCurrent ? 'bg-muted-bg text-primary' : 
                  'bg-muted-bg text-muted'
                }`}>
                  {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : 
                   isCurrent ? <Loader2 className="w-5 h-5 animate-spin" /> : 
                   <div className="w-2 h-2 rounded-full bg-muted"></div>}
                </div>
                <div className="flex-1">
                  <p className={`font-medium ${isCurrent ? 'text-primary' : ''}`}>
                    {s.label}
                  </p>
                  <p className="text-xs text-muted font-mono mt-1">
                    {isCompleted ? 'Done (✓)' : isCurrent ? 'Processing...' : 'Pending'}
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

function ResultsScreen({ onReset }: { onReset: () => void }) {
  return (
    <div className="w-full max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-700 space-y-8">
      
      <div className="flex items-center justify-between border-b border-card-border pb-6">
        <div>
          <h2 className="text-3xl font-semibold tracking-tight">Analysis Results</h2>
          <p className="text-muted mt-2 font-mono text-sm">Scan completed in 4.2s • Main branch</p>
        </div>
        <button 
          onClick={onReset}
          className="px-4 py-2 bg-card border border-card-border rounded-md text-sm font-medium hover:bg-card-hover transition-colors"
        >
          New Scan
        </button>
      </div>

      <div className="bg-warning-bg/40 border border-warning-border rounded-xl p-4 flex items-start gap-4">
        <div className="mt-1 flex-shrink-0">
          <AlertTriangle className="w-6 h-6 text-warning" />
        </div>
        <div>
          <h3 className="text-lg font-medium text-warning mb-1">⚠ 2 Potential Issues Found</h3>
          <p className="text-sm text-foreground/80 leading-relaxed">
            We detected discrepancies between the data fields sent by the backend and the fields expected by the frontend. These might cause UI bugs or undefined values.
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Issue Card 1 */}
        <div className="bg-card border border-card-border rounded-xl overflow-hidden shadow-lg group">
          <div className="px-6 py-4 border-b border-card-border flex items-center justify-between bg-card-hover/50">
            <div className="flex items-center gap-3">
              <span className="flex items-center justify-center w-6 h-6 rounded bg-warning-bg border border-warning-border text-warning text-xs font-bold">1</span>
              <h4 className="font-medium text-warning">Potential Breaking Change</h4>
            </div>
            <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-muted-bg text-muted border border-card-border flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-warning animate-pulse"></div>
              Status: Possible Mismatch
            </span>
          </div>
          
          <div className="p-6 md:p-8 grid md:grid-cols-[1fr_auto_1fr] gap-6 items-center">
            
            <div className="space-y-3">
              <div className="text-xs font-medium text-muted uppercase tracking-wider flex items-center gap-2">
                <Server className="w-4 h-4" /> Backend Output
              </div>
              <div className="bg-background rounded-lg p-5 border border-card-border relative group-hover:border-warning/50 transition-colors">
                <div className="text-sm text-muted mb-2 font-mono flex justify-between">
                  <span>api/handlers/user.go</span>
                  <span>line 42</span>
                </div>
                <div className="font-mono text-xl text-primary bg-muted-bg/50 inline-block px-3 py-1.5 rounded text-warning">
                  userId
                </div>
              </div>
            </div>

            <div className="flex justify-center md:rotate-0 rotate-90 text-muted">
              <ArrowRight className="w-8 h-8 opacity-20" />
            </div>

            <div className="space-y-3">
              <div className="text-xs font-medium text-muted uppercase tracking-wider flex items-center gap-2">
                <Layout className="w-4 h-4" /> Frontend Expectation
              </div>
              <div className="bg-background rounded-lg p-5 border border-card-border relative group-hover:border-warning/50 transition-colors">
                <div className="text-sm text-muted mb-2 font-mono flex justify-between">
                  <span>src/types/user.ts</span>
                  <span>line 18</span>
                </div>
                <div className="font-mono text-xl text-primary bg-muted-bg/50 inline-block px-3 py-1.5 rounded text-error border-b border-dashed border-error/50" style={{ color: '#ef4444' }}>
                  user_id
                </div>
              </div>
            </div>

          </div>
          <div className="bg-muted-bg/30 px-6 py-3 text-sm text-muted border-t border-card-border">
            Recommendation: Standardize on camelCase <code className="font-mono text-xs bg-muted-bg px-1 rounded">userId</code> or snake_case <code className="font-mono text-xs bg-muted-bg px-1 rounded">user_id</code> across the boundary.
          </div>
        </div>

        {/* Issue Card 2 (Secondary) */}
        <div className="bg-card border border-card-border rounded-xl overflow-hidden shadow-lg opacity-90 group">
          <div className="px-6 py-4 flex items-center justify-between border-b border-card-border">
            <div className="flex items-center gap-3">
              <span className="flex items-center justify-center w-6 h-6 rounded bg-warning-bg border border-warning-border text-warning text-xs font-bold">2</span>
              <h4 className="font-medium text-warning">Type Mismatch (Warning)</h4>
            </div>
            <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-muted-bg text-muted border border-card-border">
              Could not determine this dependency exactly
            </span>
          </div>
          <div className="px-6 py-5 flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <div className="font-mono text-sm bg-background px-3 py-2 border border-card-border rounded flex-1 w-full sm:w-auto">
              <span className="text-muted">Backend:</span> <span className="text-primary">createdAt (string/ISO8601)</span>
            </div>
            <ArrowRight className="w-4 h-4 text-muted hidden sm:block" />
            <div className="font-mono text-sm bg-background px-3 py-2 border border-card-border rounded flex-1 w-full sm:w-auto">
              <span className="text-muted">Frontend:</span> <span className="text-primary">createdAt (number/Epoch)</span>
            </div>
          </div>
        </div>

        {/* Success Card (Collapsed/Secondary) */}
        <div className="bg-success-bg/10 border border-success-border/30 rounded-xl px-6 py-4 flex items-center justify-between hover:bg-success-bg/20 transition-colors cursor-default">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-success" />
            <h4 className="font-medium text-success">✓ 12 Dependencies Matched</h4>
          </div>
          <span className="text-sm text-muted">View details</span>
        </div>

      </div>
    </div>
  );
}
