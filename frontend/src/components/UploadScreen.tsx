import React, { useState, useRef, useCallback } from 'react';
import { UploadCloud, FolderArchive, X, FileCode2, Coffee, Terminal } from 'lucide-react';
import { motion } from 'framer-motion';

interface UploadScreenProps {
  onAnalyze: (file?: File, samplePath?: string) => void;
}

export const UploadScreen: React.FC<UploadScreenProps> = ({ onAnalyze }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.name.endsWith('.zip')) setSelectedFile(file);
      else alert("Please upload a .zip file");
    }
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center min-h-[60vh] max-w-3xl mx-auto w-full"
    >
      <div className="text-center mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-stone-800 dark:text-stone-100">Analyze your codebase</h2>
        
        <div className="inline-flex flex-col items-center gap-1 text-sm bg-white dark:bg-stone-900/50 border border-stone-200 dark:border-stone-800 rounded-xl p-4 shadow-sm">
          <p className="text-stone-600 dark:text-stone-300 font-medium mb-1">Upload a .zip containing your codebase.</p>
          <div className="flex flex-col sm:flex-row gap-x-6 gap-y-2 text-stone-500">
            <span><strong className="text-stone-700 dark:text-stone-200 font-semibold">Backends:</strong> Python (Flask), Java (Spring Boot), C/C++ (Crow)</span>
            <span className="hidden sm:inline text-stone-300 dark:text-stone-700">•</span>
            <span><strong className="text-stone-700 dark:text-stone-200 font-semibold">Frontend:</strong> React/JS</span>
          </div>
        </div>
      </div>

      <div 
        className={`w-full relative overflow-hidden rounded-2xl border-2 border-dashed transition-all duration-300 p-12 flex flex-col items-center justify-center ${
          isDragging 
            ? 'border-orange-400 bg-orange-50 dark:border-orange-500 dark:bg-orange-500/10' 
            : 'border-stone-300 bg-white dark:border-stone-800 dark:bg-stone-900/30'
        } hover:border-orange-400 dark:hover:border-orange-500/60 cursor-pointer group shadow-sm`}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={(e) => { e.preventDefault(); setIsDragging(false); }}
        onDrop={handleDrop}
        onClick={() => !selectedFile && fileInputRef.current?.click()}
      >
        <input type="file" accept=".zip" className="hidden" ref={fileInputRef} onChange={(e) => {
          if (e.target.files?.[0]) setSelectedFile(e.target.files[0]);
        }} />
        
        {selectedFile ? (
          <div className="flex flex-col items-center z-10 w-full">
            <div className="w-16 h-16 mb-4 rounded-full bg-orange-100 dark:bg-orange-500/20 text-orange-600 dark:text-orange-400 flex items-center justify-center">
              <FolderArchive className="w-8 h-8" />
            </div>
            <p className="font-mono text-stone-800 dark:text-stone-200 mb-1">{selectedFile.name}</p>
            <p className="text-sm text-stone-500 dark:text-stone-400 mb-6">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
            
            <div className="flex gap-3">
              <button 
                onClick={(e) => { e.stopPropagation(); setSelectedFile(null); }}
                className="px-4 py-2 rounded-lg bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700 font-medium text-sm flex items-center gap-2 transition-colors"
              >
                <X className="w-4 h-4" /> Remove
              </button>
              <button 
                onClick={(e) => { e.stopPropagation(); onAnalyze(selectedFile); }}
                className="px-6 py-2 rounded-lg bg-orange-600 hover:bg-orange-700 text-white font-medium text-sm transition-colors shadow-sm"
              >
                Analyze Project
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center z-10 pointer-events-none">
            <div className="w-16 h-16 mb-6 rounded-2xl bg-stone-50 border-stone-200 dark:bg-stone-800 border dark:border-stone-700 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
              <UploadCloud className={`w-8 h-8 ${isDragging ? 'text-orange-500' : 'text-stone-400 dark:text-stone-500'}`} />
            </div>
            <p className="font-medium text-stone-700 dark:text-stone-300 mb-1">Drop your project ZIP here</p>
            <p className="text-sm text-stone-500 dark:text-stone-500">or click to browse files</p>
          </div>
        )}
      </div>

      {!selectedFile && (
        <div className="mt-10 flex items-center gap-4 w-full max-w-md">
          <div className="flex-1 h-px bg-stone-200 dark:bg-stone-800"></div>
          <span className="text-sm text-stone-400 uppercase tracking-widest font-semibold">Try A Sample</span>
          <div className="flex-1 h-px bg-stone-200 dark:bg-stone-800"></div>
        </div>
      )}
      
      {!selectedFile && (
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <button 
            onClick={() => onAnalyze(undefined, 'sample_project')}
            className="px-5 py-2.5 rounded-lg bg-white border border-stone-200 text-stone-700 hover:bg-stone-50 hover:border-orange-300 dark:bg-stone-900 dark:border-stone-800 dark:text-stone-300 dark:hover:bg-stone-800 dark:hover:border-orange-500/50 font-medium transition-all shadow-sm flex items-center gap-2"
          >
            <FileCode2 className="w-4 h-4 text-blue-500" />
            Python Sample
          </button>
          
          <button 
            onClick={() => onAnalyze(undefined, 'sample_project_java')}
            className="px-5 py-2.5 rounded-lg bg-white border border-stone-200 text-stone-700 hover:bg-stone-50 hover:border-orange-300 dark:bg-stone-900 dark:border-stone-800 dark:text-stone-300 dark:hover:bg-stone-800 dark:hover:border-orange-500/50 font-medium transition-all shadow-sm flex items-center gap-2"
          >
            <Coffee className="w-4 h-4 text-orange-500" />
            Java Sample
          </button>
          
          <button 
            onClick={() => onAnalyze(undefined, 'sample_project_cpp')}
            className="px-5 py-2.5 rounded-lg bg-white border border-stone-200 text-stone-700 hover:bg-stone-50 hover:border-orange-300 dark:bg-stone-900 dark:border-stone-800 dark:text-stone-300 dark:hover:bg-stone-800 dark:hover:border-orange-500/50 font-medium transition-all shadow-sm flex items-center gap-2"
          >
            <Terminal className="w-4 h-4 text-purple-500" />
            C++ Sample
          </button>
        </div>
      )}
    </motion.div>
  );
};
