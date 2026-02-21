import { useState, useEffect } from 'react';
import { analyzeImage } from '../services/aiService';
import { AnalysisResult, VisionState } from '../types';
import { formatPrompt } from '../utils/helpers';

export function useVisionAPI() {
  const [state, setState] = useState<VisionState>({
    isAnalyzing: false,
    error: null,
    currentResult: null,
    history: []
  });

  // Load history from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('vision_history');
    if (saved) {
      try {
        setState(prev => ({ ...prev, history: JSON.parse(saved) }));
      } catch (e) {
        console.error('Failed to load history', e);
      }
    }
  }, []);

  // Save history to localStorage
  useEffect(() => {
    localStorage.setItem('vision_history', JSON.stringify(state.history));
  }, [state.history]);

  const extract = async (base64: string, mimeType: string) => {
    setState(prev => ({ ...prev, isAnalyzing: true, error: null }));
    
    try {
      const details = await analyzeImage(base64, mimeType);
      const prompt = formatPrompt(details);
      
      const newResult: AnalysisResult = {
        id: crypto.randomUUID(),
        timestamp: Date.now(),
        imageUrl: base64,
        prompt,
        details
      };

      setState(prev => ({
        ...prev,
        isAnalyzing: false,
        currentResult: newResult,
        history: [newResult, ...prev.history].slice(0, 12) // Keep last 12
      }));
    } catch (err: any) {
      setState(prev => ({
        ...prev,
        isAnalyzing: false,
        error: err.message || 'An unexpected error occurred'
      }));
    }
  };

  const selectHistoryItem = (item: AnalysisResult) => {
    setState(prev => ({ ...prev, currentResult: item }));
  };

  const clearHistory = () => {
    setState(prev => ({ ...prev, history: [] }));
  };

  return {
    ...state,
    extract,
    selectHistoryItem,
    clearHistory
  };
}
