export type DevLabCategory = 
  | 'TRADING' 
  | 'TECH' 
  | 'UX' 
  | 'FEATURE' 
  | 'COMPETITION' 
  | 'INNOVATION';

export type ImpactLevel = 'HIGH' | 'MEDIUM' | 'LOW';
export type EffortLevel = 'HIGH' | 'MEDIUM' | 'LOW';
export type SuggestionStatus = 'active' | 'completed' | 'dismissed';

export interface DevLabSuggestion {
  id: string;
  title: string;
  description: string;
  category: DevLabCategory;
  tags: string[];
  impact: ImpactLevel;
  effort: EffortLevel;
  status: SuggestionStatus;
  fullAnalysis: string;
  createdAt: string;
}

export interface DevLabState {
  suggestions: DevLabSuggestion[];
  addSuggestion: (suggestion: DevLabSuggestion) => void;
  removeSuggestion: (id: string) => void; // Ação de Descartar
  completeSuggestion: (id: string) => void; // Ação de Concluir
  reset: () => void;
}
