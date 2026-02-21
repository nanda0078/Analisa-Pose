import { Scan, AlertCircle, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import Header from './components/Header';
import UploadZone from './components/UploadZone';
import AnalysisResultView from './components/AnalysisResult';
import HistoryList from './components/HistoryList';
import { useVisionAPI } from './hooks/useVisionAPI';

export default function App() {
  const { 
    isAnalyzing, 
    error, 
    currentResult, 
    history, 
    extract, 
    selectHistoryItem, 
    clearHistory 
  } = useVisionAPI();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-8 md:py-12 max-w-6xl">
        <div className="flex flex-col gap-8">
          {/* Hero Section */}
          <div className="text-center space-y-4 mb-4">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold uppercase tracking-widest"
            >
              <Sparkles size={14} />
              AI-Powered Extraction
            </motion.div>
            <motion.h1 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-5xl font-bold tracking-tight text-white"
            >
              VisionPrompt
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-slate-400 max-w-2xl mx-auto text-lg"
            >
              Extract professional-grade pose and background descriptions from any image. 
              Perfect for prompt engineering and AI art generation.
            </motion.p>
          </div>

          {/* Main Interface */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="space-y-6"
            >
              <div className="flex items-center gap-2 text-slate-300 font-semibold mb-2">
                <Scan size={20} className="text-indigo-400" />
                <h2>Image Input</h2>
              </div>
              <UploadZone onImageSelect={extract} isAnalyzing={isAnalyzing} />
              
              {error && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 flex gap-3 items-center"
                >
                  <AlertCircle size={20} />
                  <p className="text-sm font-medium">{error}</p>
                </motion.div>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="space-y-6"
            >
              <div className="flex items-center gap-2 text-slate-300 font-semibold mb-2">
                <Sparkles size={20} className="text-indigo-400" />
                <h2>Analysis Result</h2>
              </div>
              <AnalysisResultView result={currentResult} isAnalyzing={isAnalyzing} />
            </motion.div>
          </div>

          {/* History Section */}
          <HistoryList 
            history={history} 
            onSelect={selectHistoryItem} 
            onClear={clearHistory} 
          />
        </div>
      </main>

      <footer className="py-8 border-t border-slate-800 text-center text-slate-500 text-sm">
        <p>© {new Date().getFullYear()} VisionPrompt. Built with Gemini AI.</p>
      </footer>
    </div>
  );
}
