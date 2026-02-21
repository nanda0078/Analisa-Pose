export interface AnalysisResult {
  id: string;
  timestamp: number;
  imageUrl: string;
  prompt: string;
  details: {
    pose: string;
    clothing: string;
    background: string;
    lighting: string;
  };
}

export interface VisionState {
  isAnalyzing: boolean;
  error: string | null;
  currentResult: AnalysisResult | null;
  history: AnalysisResult[];
}
