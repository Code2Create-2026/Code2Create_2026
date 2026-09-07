export type Status = 'ok' | 'warning' | 'error';
export type MatchStatus = 'match' | 'possible_mismatch' | 'missing_in_backend' | 'missing_in_frontend';
export type Confidence = 'confirmed' | 'high' | 'low' | 'probable' | 'uncertain';

export interface FieldLocation {
  name: string;
  file: string;
  line: number;
}

export interface AnalysisResult {
  backend_field?: FieldLocation;
  frontend_field?: FieldLocation;
  status: MatchStatus;
  confidence: Confidence;
  message: string;
}

export interface EndpointAnalysis {
  endpoint: string;
  results: AnalysisResult[];
}

export interface AnalysisSummary {
  total: number;
  matches: number;
  possible_mismatches: number;
  missing_in_backend: number;
  missing_in_frontend: number;
  has_issues: boolean;
}

export interface AnalysisResponse {
  status: Status;
  summary: AnalysisSummary;
  endpoints: EndpointAnalysis[];
}
