
export interface Employee {
  id: number;
  nameEn: string;
  nameKa: string;
  currentRoleEn: string;
  currentRoleKa: string;
  departmentEn: string;
  departmentKa: string;
  hireDate: string;
  performanceScore: number;
  skills: Skill[];
  location?: string;
  performanceHistory: number[];
  grade: 'A' | 'B' | 'C' | 'S';
  salary: number;
  insurance: number;
  allowances: number;
  status: 'active' | 'onboarding' | 'terminated' | 'vacant';
  contractType: 'Full-time' | 'Contractor' | 'Rotational';
  certifications?: string[];
}

export interface Skill {
  name: string;
  level: number;
  category: 'Technical' | 'Soft' | 'Business' | 'Leadership';
}

export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
  thinkingSteps?: string[]; 
  workflowTriggered?: boolean;
}

export interface ActionCard {
  id: string;
  type: string;
  titleEn: string;
  titleKa: string;
  descriptionEn: string;
  descriptionKa: string;
  priority: 'low' | 'medium' | 'high';
  confidence: number;
  impactScore: number;
  status: 'PENDING' | 'ACCEPTED' | 'DECLINED' | 'EXECUTING' | 'ANALYZED';
}

export interface TuningConfig {
  reasoningDepth: number; 
  creativity: number; 
  strictness: number; 
  ethicalGuardrails: boolean;
  learningRate?: number;
  contextWindow?: 'Standard' | 'Expanded' | 'Exhaustive';
}

export interface WorkflowExecution {
  id: string;
  workflowName: string;
  status: 'SUCCESS' | 'FAILED' | 'RUNNING';
  startedAt: string;
  duration: number;
  trigger: string;
  recordsProcessed: number;
  intent?: string;
}

export interface SystemHealth {
  service: string;
  status: 'OPERATIONAL' | 'DEGRADED' | 'FAILED';
  latency: number;
  breakerState: 'CLOSED' | 'OPEN' | 'HALF_OPEN';
}

export interface Company {
  id: string;
  nameEn: string;
  nameKa: string;
  departments: string[];
}

export interface ROIInputs {
  unitOutputAlpha: number;
  unitYieldBeta: number;
  localCurrencyRate: number;
  entities?: string;
}

export interface FinancialTemplate {
  id: string;
  name: string;
  category: string;
  description: string;
  prompt: string;
}

export interface CompetencyGap {
  readiness_score: number;
  gaps: {
    skill: string;
    priority: string;
    recommendation: string;
    current: number;
    target: number;
  }[];
}

export interface Debt {
  id: string;
  name: string;
  balance: number;
  interestRate: number;
  minPayment: number;
}

export interface Position {
  id: string;
  title: string;
  department: string;
  requirements?: string[];
}

export interface FinancialStatementRow {
  label: string;
  budget: number;
  actual: number;
  variance: number;
  variancePct: number;
}

export interface CapexProject {
  id: string;
  title: string;
  budget: string;
  status: string;
  progress: number;
  iconType: 'cpu' | 'zap' | 'box' | 'shield';
  color: string;
}

export interface DebtSimulationResult {
  months: number;
  totalInterest: number;
  strategy: 'Snowball' | 'Avalanche';
  payoffLog: Record<string, number>;
}

export interface AdHocQueryProposal {
  operation: 'SELECT' | 'INSERT' | 'UPDATE';
  table: string;
  columns?: string[];
  filters?: { field: string; op: string; value: any }[];
  limit?: number;
  reasoning?: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  actor: string;
  intent: string;
  status: 'PENDING' | 'COMMITTED' | 'REJECTED';
  table: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'ai';
  timestamp: number;
}
