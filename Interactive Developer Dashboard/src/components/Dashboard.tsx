import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Download, Plus, Activity, FileJson, GitCommitHorizontal, FileCode2, Copy, Coffee, Terminal, Atom, FileText } from 'lucide-react';
import { AnalysisResponse, EndpointAnalysis, AnalysisResult } from '../types/analysis';

// --- Shared Components ---

const CopyButton = ({ text }: { text: string }) => {
  const [copied, setCopied] = useState(false);
  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button onClick={handleCopy} className="ml-2 text-stone-400 hover:text-stone-600 dark:hover:text-stone-300 transition-colors shrink-0">
      {copied ? <span className="text-[10px] uppercase font-bold text-emerald-500">Copied</span> : <Copy className="w-3.5 h-3.5" />}
    </button>
  );
};

const FileIcon = ({ filename }: { filename: string }) => {
  if (filename.endsWith('.java')) return <Coffee className="w-4 h-4 text-orange-500 shrink-0" />;
  if (filename.endsWith('.py')) return <FileCode2 className="w-4 h-4 text-blue-500 shrink-0" />;
  if (filename.match(/\.(cpp|c|cc|h|hpp)$/)) return <Terminal className="w-4 h-4 text-purple-500 shrink-0" />;
  if (filename.match(/\.(jsx?|tsx?)$/)) return <Atom className="w-4 h-4 text-cyan-500 shrink-0" />;
  return <FileText className="w-4 h-4 text-stone-500 shrink-0" />;
};

// --- Subcomponents ---

const StatCard = ({ title, value, type, highlight = false }: { title: string, value: number, type: 'default' | 'success' | 'warning' | 'error', highlight?: boolean }) => {
  const isHighlighted = highlight && value > 0;
  
  const colorClass = isHighlighted
    ? { warning: 'text-amber-700 dark:text-amber-400', error: 'text-rose-700 dark:text-rose-400', success: 'text-emerald-700 dark:text-emerald-400', default: 'text-stone-900 dark:text-stone-100' }[type]
    : 'text-stone-900 dark:text-stone-100';
    
  const borderClass = isHighlighted
    ? { warning: 'border-amber-300 bg-amber-50 dark:border-amber-500/30 dark:bg-amber-500/5', error: 'border-rose-300 bg-rose-50 dark:border-rose-500/30 dark:bg-rose-500/5', success: 'border-emerald-300 bg-emerald-50 dark:border-emerald-500/30 dark:bg-emerald-500/5', default: 'border-stone-200 bg-white dark:border-stone-800 dark:bg-stone-900/50' }[type]
    : 'border-stone-200 bg-white dark:border-stone-800 dark:bg-stone-900/50';

  return (
    <div className={`p-5 rounded-xl border flex flex-col gap-2 transition-colors shadow-sm ${borderClass}`}>
      <span className="text-stone-500 dark:text-stone-400 text-sm font-medium">{title}</span>
      <span className={`text-3xl font-semibold ${colorClass}`}>{value}</span>
    </div>
  );
};

const IssueCard = ({ result }: { result: AnalysisResult }) => {
  const isMismatch = result.status === 'possible_mismatch';
  const isMissingFrontend = result.status === 'missing_in_frontend';
  const isMissingBackend = result.status === 'missing_in_backend';
  const isMatch = result.status === 'match';

  let alertStyle = "bg-stone-50 border-stone-200 dark:bg-stone-900/50 dark:border-stone-800";
  let label = "Exact Match";
  
  if (isMismatch) {
    alertStyle = "bg-amber-50 border-amber-200 dark:bg-amber-500/5 dark:border-amber-500/20";
    label = "Possible Mismatch";
  } else if (isMissingFrontend || isMissingBackend) {
    alertStyle = "bg-rose-50 border-rose-200 dark:bg-rose-500/5 dark:border-rose-500/20";
    label = "Missing Field";
  }

  return (
    <div className={`p-4 rounded-xl border transition-colors ${alertStyle}`}>
      <div className="flex items-center justify-between mb-3">
        <span className={`text-xs font-semibold uppercase tracking-wider ${isMatch ? 'text-stone-500' : 'text-orange-600 dark:text-orange-400'}`}>
          {isMatch ? '✓ ' : '⚠ '}{label}
        </span>
        <span className="text-xs text-stone-500 border border-stone-200 dark:border-stone-700 rounded px-2 py-0.5 bg-white dark:bg-stone-900">
          Confidence: {result.confidence}
        </span>
      </div>
      
      <p className="text-sm text-stone-700 dark:text-stone-300 mb-4">{result.message}</p>
      
      <div className="flex flex-col gap-3 font-mono text-sm">
        {result.backend_field ? (
          <div className="flex flex-col gap-1.5 p-2.5 rounded bg-white dark:bg-stone-950 border border-stone-200 dark:border-stone-800">
            <div className="text-[11px] text-stone-400 uppercase tracking-wider mb-0.5 flex items-center">
              Backend Output
            </div>
            <div className="flex flex-wrap items-center text-stone-800 dark:text-stone-200 gap-x-3 gap-y-1">
              <span className="font-semibold text-orange-600 dark:text-orange-400">{result.backend_field.name}</span>
              <div className="flex items-center gap-1.5 text-stone-500 text-xs ml-auto min-w-0 max-w-full">
                <FileIcon filename={result.backend_field.file} />
                <span className="truncate" title={`${result.backend_field.file}:${result.backend_field.line}`}>
                  {result.backend_field.file}:{result.backend_field.line}
                </span>
                <CopyButton text={`${result.backend_field.file}:${result.backend_field.line}`} />
              </div>
            </div>
          </div>
        ) : (
          <div className="p-3 rounded bg-stone-100 dark:bg-stone-900 border border-dashed border-stone-300 dark:border-stone-700 text-stone-400 italic text-center text-xs">Missing in Backend</div>
        )}

        {result.frontend_field ? (
          <div className="flex flex-col gap-1.5 p-2.5 rounded bg-white dark:bg-stone-950 border border-stone-200 dark:border-stone-800">
            <div className="text-[11px] text-stone-400 uppercase tracking-wider mb-0.5 flex items-center">
              Frontend Expectation
            </div>
            <div className="flex flex-wrap items-center text-stone-800 dark:text-stone-200 gap-x-3 gap-y-1">
              <span className="font-semibold text-emerald-600 dark:text-emerald-400">{result.frontend_field.name}</span>
              <div className="flex items-center gap-1.5 text-stone-500 text-xs ml-auto min-w-0 max-w-full">
                <FileIcon filename={result.frontend_field.file} />
                <span className="truncate" title={`${result.frontend_field.file}:${result.frontend_field.line}`}>
                  {result.frontend_field.file}:{result.frontend_field.line}
                </span>
                <CopyButton text={`${result.frontend_field.file}:${result.frontend_field.line}`} />
              </div>
            </div>
          </div>
        ) : (
          <div className="p-3 rounded bg-stone-100 dark:bg-stone-900 border border-dashed border-stone-300 dark:border-stone-700 text-stone-400 italic text-center text-xs">Missing in Frontend</div>
        )}
      </div>
    </div>
  );
}

const EndpointAccordion = ({ data }: { data: EndpointAnalysis }) => {
  const [isOpen, setIsOpen] = useState(true);
  const issuesCount = data.results.filter(r => r.status !== 'match').length;

  return (
    <div className="border border-stone-200 dark:border-stone-800 rounded-xl overflow-hidden bg-white dark:bg-stone-900/30">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 bg-stone-50 hover:bg-stone-100 dark:bg-stone-900 dark:hover:bg-stone-800 transition-colors text-left"
      >
        <div className="flex items-center gap-3">
          <Activity className="w-5 h-5 text-stone-400" />
          <span className="font-mono text-sm font-medium text-stone-800 dark:text-stone-200">{data.endpoint}</span>
          {issuesCount > 0 && (
            <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400 text-xs font-mono font-medium border border-rose-200 dark:border-rose-500/20">
              {issuesCount} Issue{issuesCount !== 1 ? 's' : ''}
            </span>
          )}
        </div>
      </button>
      
      {isOpen && (
        <div className="p-4 grid grid-cols-1 lg:grid-cols-2 gap-4 bg-white dark:bg-transparent">
          {data.results.map((res, i) => <IssueCard key={i} result={res} />)}
        </div>
      )}
    </div>
  );
}

// --- Main Dashboard Component ---

interface DashboardProps {
  data: AnalysisResponse;
  onReset: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ data, onReset }) => {
  const [filter, setFilter] = useState<'all' | 'issues'>('all');
  
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8 pb-12">
      
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
          <input 
            type="text" 
            placeholder="Search endpoints (Press /)" 
            className="w-full pl-10 pr-4 py-2 rounded-lg bg-white border border-stone-200 dark:bg-stone-900 dark:border-stone-800 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none transition-all shadow-sm text-sm"
          />
        </div>
        
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button onClick={onReset} className="flex-1 sm:flex-none px-4 py-2 rounded-lg border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 hover:bg-stone-50 dark:hover:bg-stone-800 text-sm font-medium transition-colors flex items-center justify-center gap-2">
            <Plus className="w-4 h-4" /> New Analysis
          </button>
          <button className="flex-1 sm:flex-none px-4 py-2 rounded-lg bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 hover:bg-stone-800 dark:hover:bg-white text-sm font-medium transition-colors flex items-center justify-center gap-2 shadow-sm">
            <Download className="w-4 h-4" /> Export JSON
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total APIs Analyzed" value={data.endpoints.length} type="default" />
        <StatCard title="Total Fields" value={data.summary.total} type="default" />
        <StatCard title="Issues Detected" value={data.summary.possible_mismatches + data.summary.missing_in_backend + data.summary.missing_in_frontend} type="error" highlight />
        <StatCard title="Exact Matches" value={data.summary.matches} type="success" />
      </div>

      {/* Main Content Area: Impact Map (stub) & Endpoints */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Left Col: Endpoint List */}
        <div className="xl:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold flex items-center gap-2 text-stone-800 dark:text-stone-200">
              <FileJson className="w-5 h-5 text-stone-400" />
              Endpoint Explorer
            </h3>
            
            <div className="flex bg-stone-100 dark:bg-stone-900 p-1 rounded-lg border border-stone-200 dark:border-stone-800">
              <button 
                onClick={() => setFilter('all')} 
                className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${filter === 'all' ? 'bg-white dark:bg-stone-800 shadow-sm text-stone-800 dark:text-stone-200' : 'text-stone-500'}`}
              >
                All
              </button>
              <button 
                onClick={() => setFilter('issues')} 
                className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${filter === 'issues' ? 'bg-white dark:bg-stone-800 shadow-sm text-stone-800 dark:text-stone-200' : 'text-stone-500'}`}
              >
                Issues Only
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            {data.endpoints.map((ep, idx) => {
              if (filter === 'issues' && !ep.results.some(r => r.status !== 'match')) return null;
              return <EndpointAccordion key={idx} data={ep} />;
            })}
          </div>
        </div>

        {/* Right Col: Impact Map (Signature Feature Stub) */}
        <div className="space-y-6">
          <h3 className="text-lg font-semibold flex items-center gap-2 text-stone-800 dark:text-stone-200">
            <GitCommitHorizontal className="w-5 h-5 text-stone-400" />
            Impact Map
          </h3>
          
          <div className="border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900/30 rounded-xl p-6 h-[400px] flex flex-col">
            <p className="text-sm text-stone-500 mb-6">Interactive visualization of frontend components dependent on backend responses.</p>
            
            <div className="flex-1 rounded-lg border border-dashed border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-900/50 flex flex-col items-center justify-center p-4">
               <GitCommitHorizontal className="w-8 h-8 text-stone-300 dark:text-stone-600 mb-4" />
               
               <div className="w-full max-w-[280px] bg-white dark:bg-stone-950 border border-stone-200 dark:border-stone-800 p-2.5 rounded-lg shadow-sm mb-4">
                 <div className="flex items-center gap-2 mb-1">
                   <Coffee className="w-3.5 h-3.5 text-orange-500 shrink-0" />
                   <span className="text-xs font-semibold text-stone-700 dark:text-stone-300 truncate">SettingsController</span>
                 </div>
                 <div className="text-[10px] text-stone-400 font-mono truncate w-full" title="src/main/java/com/example/api/SettingsController.java">
                   src/main/java/com/example/api/SettingsController.java
                 </div>
               </div>

               <span className="text-sm font-medium text-stone-400 text-center max-w-[240px] leading-relaxed">
                 Graph visualization supports wide nodes for deep Java/C++ file paths.
               </span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
