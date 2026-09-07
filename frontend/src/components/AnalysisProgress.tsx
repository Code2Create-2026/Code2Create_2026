import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Loader2, Circle } from 'lucide-react';

const STEPS = [
  "Reading files & extracting codebase",
  "Detecting API endpoints & definitions",
  "Scanning frontend dependencies & usages",
  "Building impact map & generating report"
];

export const AnalysisProgress: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    // Simulate real-time progress steps for UI feedback
    const timers = [
      setTimeout(() => setCurrentStep(1), 800),
      setTimeout(() => setCurrentStep(2), 1600),
      setTimeout(() => setCurrentStep(3), 2600),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center min-h-[60vh] max-w-md mx-auto w-full"
    >
      <div className="w-full bg-white dark:bg-stone-900/50 border border-stone-200 dark:border-stone-800 rounded-2xl p-8 shadow-sm">
        <h3 className="text-xl font-semibold mb-6 text-stone-800 dark:text-stone-100">Analyzing Project</h3>
        
        <div className="flex flex-col gap-4">
          {STEPS.map((step, idx) => {
            const isCompleted = currentStep > idx;
            const isActive = currentStep === idx;
            const isPending = currentStep < idx;

            return (
              <div key={idx} className={`flex items-center gap-3 transition-colors duration-300 ${
                isCompleted ? 'text-stone-700 dark:text-stone-300' : 
                isActive ? 'text-orange-600 dark:text-orange-400 font-medium' : 
                'text-stone-400 dark:text-stone-600'
              }`}>
                {isCompleted && <CheckCircle2 className="w-5 h-5 text-emerald-500" />}
                {isActive && <Loader2 className="w-5 h-5 animate-spin" />}
                {isPending && <Circle className="w-5 h-5 opacity-50" />}
                <span className="text-sm">{step}</span>
              </div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
};
