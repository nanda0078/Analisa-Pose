import { History, Clock, Trash2 } from 'lucide-react';
import { AnalysisResult } from '../types';
import { motion, AnimatePresence } from 'motion/react';

interface HistoryListProps {
  history: AnalysisResult[];
  onSelect: (result: AnalysisResult) => void;
  onClear: () => void;
}

export default function HistoryList({ history, onSelect, onClear }: HistoryListProps) {
  if (history.length === 0) return null;

  return (
    <div className="mt-12 pt-8 border-t border-slate-800">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2 text-slate-400">
          <History size={20} />
          <h3 className="font-semibold">Recent Extractions</h3>
        </div>
        <button
          onClick={onClear}
          className="text-xs text-slate-500 hover:text-red-400 flex items-center gap-1 transition-colors"
        >
          <Trash2 size={14} />
          Clear History
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <AnimatePresence>
          {history.map((item) => (
            <motion.button
              key={item.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              onClick={() => onSelect(item)}
              className="group relative aspect-square rounded-xl overflow-hidden glass hover:border-indigo-500/50 transition-all"
            >
              <img
                src={item.imageUrl}
                alt="History item"
                className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-2">
                <div className="flex items-center gap-1 text-[10px] text-slate-300">
                  <Clock size={10} />
                  {new Date(item.timestamp).toLocaleDateString()}
                </div>
              </div>
            </motion.button>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
