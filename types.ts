
export enum PhaseType {
  Trajectory = 'Trajectory', // Delta S
  Velocity = 'Velocity',     // Delta I
  Viscosity = 'Viscosity'    // Delta O
}

export interface SectionContent {
  id: string;
  title: string;
  subtitle: string;
  icon: any;
  color: string;
  phase: PhaseType;
  summary: string;
  content: string;
}

export type SimulationState = {
  [key in PhaseType]: number;
};

export interface QuizOption {
  text: string;
  score: number;
}

export interface QuizQuestion {
  id: number;
  dimension: PhaseType;
  question: string;
  options: QuizOption[];
}

export interface KeywordWeight {
  word: string;
  dimension: PhaseType;
  score: number; // Positive adds to dimension, Negative subtracts (or indicates opposite)
}
