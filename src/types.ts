export type Track = 'Robotics' | 'Coding Logic' | 'Computer Architecture';

export type Difficulty = 'Beginner' | 'Intermediate' | 'Advanced';

export interface Lesson {
  id: string;
  title: string;
  track: Track;
  objective: string;
  steps: string[];
  difficulty: Difficulty;
  xpReward: number;
}

export interface AnalysisMetric {
  label: string;
  value: number;
  insight: string;
}

export interface ScanReport {
  id: string;
  createdAt: string;
  track: Track;
  overallScore: number;
  metrics: AnalysisMetric[];
  strengths: string[];
  recommendations: string[];
}
