import React, { useMemo, useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Coffee, FileCode2, Terminal, Atom, FileText, Database, Layout } from 'lucide-react';
import { AnalysisResponse } from '../types/analysis';

const FileIcon = ({ filename, className }: { filename: string, className?: string }) => {
  const ext = filename.split('.').pop()?.toLowerCase();
  switch (ext) {
    case 'java': return <Coffee className={className || "w-4 h-4 text-orange-500 shrink-0"} />;
    case 'py': return <FileCode2 className={className || "w-4 h-4 text-blue-500 shrink-0"} />;
    case 'cpp':
    case 'c':
    case 'cc':
    case 'h':
    case 'hpp': return <Terminal className={className || "w-4 h-4 text-purple-500 shrink-0"} />;
    case 'js':
    case 'jsx':
    case 'ts':
    case 'tsx': return <Atom className={className || "w-4 h-4 text-cyan-500 shrink-0"} />;
    default: return <FileText className={className || "w-4 h-4 text-stone-500 shrink-0"} />;
  }
};

interface ImpactMapProps {
  data: AnalysisResponse;
}

interface Node {
  id: string;
  name: string;
  type: 'backend' | 'frontend';
}

interface Link {
  source: string;
  target: string;
}

export const ImpactMap: React.FC<ImpactMapProps> = ({ data }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const nodeRefs = useRef<Record<string, HTMLDivElement | null>>({});
  
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [lines, setLines] = useState<{ id: string, d: string, source: string, target: string }[]>([]);

  // 1. Data Extraction
  const { backendNodes, frontendNodes, links } = useMemo(() => {
    const bNodes: Record<string, Node> = {};
    const fNodes: Record<string, Node> = {};
    const linkSet = new Set<string>();
    const extractedLinks: Link[] = [];

    data.endpoints.forEach(ep => {
      ep.results.forEach(res => {
        if (res.backend_field && res.frontend_field) {
          const bFile = res.backend_field.file;
          const fFile = res.frontend_field.file;
          
          if (!bNodes[bFile]) bNodes[bFile] = { id: bFile, name: bFile.split('/').pop() || bFile, type: 'backend' };
          if (!fNodes[fFile]) fNodes[fFile] = { id: fFile, name: fFile.split('/').pop() || fFile, type: 'frontend' };
          
          const linkId = `${bFile}::${fFile}`;
          if (!linkSet.has(linkId)) {
            linkSet.add(linkId);
            extractedLinks.push({ source: bFile, target: fFile });
          }
        }
      });
    });

    return {
      backendNodes: Object.values(bNodes),
      frontendNodes: Object.values(fNodes),
      links: extractedLinks
    };
  }, [data]);

  // 2. Line Calculation
  const updateLines = () => {
    if (!containerRef.current) return;
    const containerRect = containerRef.current.getBoundingClientRect();
    
    const newLines = links.map(link => {
      const sourceEl = nodeRefs.current[link.source];
      const targetEl = nodeRefs.current[link.target];
      
      if (!sourceEl || !targetEl) return null;
      
      const sourceRect = sourceEl.getBoundingClientRect();
      const targetRect = targetEl.getBoundingClientRect();
      
      // Calculate connection points relative to container
      // Add a tiny bit of padding to the X coordinates so lines don't overlap borders
      const x1 = sourceRect.right - containerRect.left + 8;
      const y1 = sourceRect.top + (sourceRect.height / 2) - containerRect.top;
      
      const x2 = targetRect.left - containerRect.left - 8;
      const y2 = targetRect.top + (targetRect.height / 2) - containerRect.top;
      
      // Bezier control points for a smooth curve
      const offset = Math.abs(x2 - x1) * 0.4;
      const d = `M ${x1} ${y1} C ${x1 + offset} ${y1}, ${x2 - offset} ${y2}, ${x2} ${y2}`;
      
      return { id: `${link.source}-${link.target}`, source: link.source, target: link.target, d };
    }).filter(Boolean) as any;
    
    setLines(newLines);
  };

  useEffect(() => {
    // Initial draw and setup observers
    const timer = setTimeout(updateLines, 100);
    window.addEventListener('resize', updateLines);
    
    const observer = new ResizeObserver(updateLines);
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }
    
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', updateLines);
      observer.disconnect();
    };
  }, [links, backendNodes.length, frontendNodes.length]);

  // 3. Render Helpers
  const getIsActive = (id: string, type: 'backend'|'frontend') => {
    if (!hoveredNode) return true; // all active if nothing hovered
    if (hoveredNode === id) return true;
    
    if (type === 'backend') return links.some(l => l.target === hoveredNode && l.source === id);
    return links.some(l => l.source === hoveredNode && l.target === id);
  };

  const getIsLineActive = (source: string, target: string) => {
    if (!hoveredNode) return false; // Default: subtle lines
    return source === hoveredNode || target === hoveredNode;
  };

  if (backendNodes.length === 0 || frontendNodes.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 text-center bg-stone-50 dark:bg-stone-900/50 rounded-lg border border-dashed border-stone-300 dark:border-stone-700 min-h-[300px]">
        <Layout className="w-8 h-8 text-stone-300 dark:text-stone-600 mb-3" />
        <p className="text-sm text-stone-500">Not enough data to map impact.</p>
      </div>
    );
  }

  return (
    <div 
      className="relative w-full h-full min-h-[400px] overflow-x-auto overflow-y-auto bg-stone-50 dark:bg-stone-900/30 rounded-xl border border-stone-200 dark:border-stone-800 scrollbar-hide"
      onMouseLeave={() => setHoveredNode(null)}
    >
      <div 
        ref={containerRef} 
        className="relative w-full min-w-[600px] min-h-full flex justify-between p-8"
      >
        
        {/* SVG Canvas for Lines */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }}>
          <defs>
            <linearGradient id="line-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#f97316" /> {/* orange-500 */}
              <stop offset="100%" stopColor="#10b981" /> {/* emerald-500 */}
            </linearGradient>
            <linearGradient id="line-gradient-dim" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="var(--color-stone-300)" stopOpacity="0.5" />
              <stop offset="100%" stopColor="var(--color-stone-300)" stopOpacity="0.5" />
            </linearGradient>
          </defs>
          <AnimatePresence>
            {lines.map((line) => {
              const isActive = getIsLineActive(line.source, line.target);
              const isDimmed = hoveredNode && !isActive;
              
              return (
                <motion.path
                  key={line.id}
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ 
                    pathLength: 1, 
                    opacity: isDimmed ? 0.1 : (isActive ? 1 : 0.3),
                    stroke: isActive ? "url(#line-gradient)" : "currentColor",
                    strokeWidth: isActive ? 2.5 : 1.5
                  }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  d={line.d}
                  fill="none"
                  className={isActive ? "" : "text-stone-400 dark:text-stone-600"}
                />
              );
            })}
          </AnimatePresence>
        </svg>

        {/* Backend Nodes Column */}
        <div className="flex flex-col justify-center gap-6 z-10 w-[240px]">
          <div className="flex items-center gap-2 mb-2 px-2">
            <Database className="w-4 h-4 text-stone-400" />
            <h4 className="text-xs font-semibold text-stone-500 uppercase tracking-wider">Backend APIs</h4>
          </div>
          {backendNodes.map(node => {
            const active = getIsActive(node.id, 'backend');
            return (
              <motion.div
                key={node.id}
                ref={el => nodeRefs.current[node.id] = el}
                onMouseEnter={() => setHoveredNode(node.id)}
                animate={{ opacity: active ? 1 : 0.4, scale: active ? 1 : 0.98 }}
                className={`p-3 rounded-xl border bg-white dark:bg-stone-950 shadow-sm transition-all cursor-default ${active && hoveredNode === node.id ? 'border-orange-500/50 shadow-orange-500/10 shadow-lg' : 'border-stone-200 dark:border-stone-800'}`}
              >
                <div className="flex items-center gap-2 mb-1.5">
                  <FileIcon filename={node.id} className="w-4 h-4 shrink-0" />
                  <span className="text-sm font-semibold text-stone-800 dark:text-stone-200 truncate">{node.name}</span>
                </div>
                <div className="text-[10px] text-stone-400 font-mono truncate" title={node.id}>
                  {node.id}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Frontend Nodes Column */}
        <div className="flex flex-col justify-center gap-6 z-10 w-[240px]">
          <div className="flex items-center gap-2 mb-2 px-2">
            <Layout className="w-4 h-4 text-stone-400" />
            <h4 className="text-xs font-semibold text-stone-500 uppercase tracking-wider">Frontend UI</h4>
          </div>
          {frontendNodes.map(node => {
            const active = getIsActive(node.id, 'frontend');
            return (
              <motion.div
                key={node.id}
                ref={el => nodeRefs.current[node.id] = el}
                onMouseEnter={() => setHoveredNode(node.id)}
                animate={{ opacity: active ? 1 : 0.4, scale: active ? 1 : 0.98 }}
                className={`p-3 rounded-xl border bg-white dark:bg-stone-950 shadow-sm transition-all cursor-default ${active && hoveredNode === node.id ? 'border-emerald-500/50 shadow-emerald-500/10 shadow-lg' : 'border-stone-200 dark:border-stone-800'}`}
              >
                <div className="flex items-center gap-2 mb-1.5">
                  <FileIcon filename={node.id} className="w-4 h-4 shrink-0" />
                  <span className="text-sm font-semibold text-stone-800 dark:text-stone-200 truncate">{node.name}</span>
                </div>
                <div className="text-[10px] text-stone-400 font-mono truncate" title={node.id}>
                  {node.id}
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </div>
  );
};
