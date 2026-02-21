import { Copy, Check, Sparkles, User, Shirt, Map, Sun } from 'lucide-react';
import { useState } from 'react';
import { AnalysisResult } from '../types';
import { motion } from 'motion/react';
import { cn } from '../utils/helpers';

interface AnalysisResultProps {
  result: AnalysisResult | null;
  isAnalyzing: boolean;
}

export default function AnalysisResultView({ result, isAnalyzing }: AnalysisResultProps) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    if (!result) return;
    await navigator.clipboard.writeText(result.prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (isAnalyzing) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-32 bg-slate-800 rounded-2xl" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-24 bg-slate-800 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-slate-500 py-12 border-2 border-dashed border-slate-800 rounded-2xl">
        <Sparkles size={48} className="mb-4 opacity-20" />
        <p>Upload an image to start extraction</p>
      </div>
    );
  }

  const detailItems = [
    { icon: User, label: 'Pose', value: result.details.pose, color: 'text-blue-400' },
    { icon: Shirt, label: 'Clothing', value: result.details.clothing, color: 'text-purple-400' },
    { icon: Map, label: 'Background', value: result.details.background, color: 'text-emerald-400' },
    { icon: Sun, label: 'Lighting', value: result.details.lighting, color: 'text-amber-400' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="glass rounded-2xl p-6 relative group">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500">Generated Prompt</h3>
          <button
            onClick={copyToClipboard}
            className={cn(
              "p-2 rounded-lg transition-all duration-200 flex items-center gap-2 text-sm",
              copied ? "bg-emerald-500/20 text-emerald-400" : "bg-slate-700 hover:bg-slate-600 text-slate-300"
            )}
          >
            {copied ? <Check size={16} /> : <Copy size={16} />}
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
        <p className="text-lg font-mono leading-relaxed text-slate-200 selection:bg-indigo-500/30">
          {result.prompt}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {detailItems.map((item, idx) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="glass rounded-xl p-4 flex gap-4"
          >
            <div className={cn("p-2 rounded-lg bg-slate-900 h-fit", item.color)}>
              <item.icon size={20} />
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">{item.label}</h4>
              <p className="text-sm text-slate-300 leading-snug">{item.value}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
