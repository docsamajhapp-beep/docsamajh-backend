export type DocumentType =
  | 'prescription'
  | 'lab_report'
  | 'radiology'
  | 'discharge_summary'
  | 'bank_statement'
  | 'loan_agreement'
  | 'insurance_policy'
  | 'investment'
  | 'court_notice'
  | 'summons'
  | 'government_policy'
  | 'unknown';

export type ModuleType = 'medical' | 'banking' | 'insurance' | 'investment' | 'legal' | 'government';

export type RiskLevel = 'low' | 'moderate' | 'high' | 'critical';

export interface RedFlag {
  icon: string;
  title: string;
  description: string;
  severity: 'warning' | 'danger';
}

export interface MedicalResult {
  type: 'prescription' | 'lab_report' | 'radiology' | 'discharge_summary';
  patientName?: string;
  doctorName?: string;
  date?: string;
  medicines?: Medicine[];
  findings?: Finding[];
  summary: string;
  plainEnglish: string;
  explainLike15: string;
  redFlags: RedFlag[];
  disclaimer: string;
}

export interface Medicine {
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  purpose: string;
  sideEffects: string[];
  interactions?: string[];
}

export interface Finding {
  parameter: string;
  value: string;
  normalRange: string;
  status: 'normal' | 'low' | 'high' | 'critical';
  plainMeaning: string;
}

export interface BankingResult {
  documentType: string;
  keyObligations: KeyObligation[];
  hiddenCharges: HiddenCharge[];
  riskAssessment: string;
  summary: string;
  plainEnglish: string;
  explainLike15: string;
  redFlags: RedFlag[];
}

export interface KeyObligation {
  label: string;
  value: string;
  highlight?: boolean;
}

export interface HiddenCharge {
  name: string;
  amount: string;
  trigger: string;
  severity: 'low' | 'moderate' | 'high';
}

export interface InsuranceResult {
  policyType: string;
  covered: string[];
  notCovered: string[];
  waitingPeriods: WaitingPeriod[];
  claimProcess: string[];
  hiddenExclusions: string[];
  summary: string;
  plainEnglish: string;
  explainLike15: string;
  redFlags: RedFlag[];
  claimRejectionRisks: string[];
}

export interface WaitingPeriod {
  condition: string;
  duration: string;
}

export interface InvestmentResult {
  productType: string;
  lockInPeriod: string;
  riskLevel: RiskLevel;
  charges: InvestmentCharge[];
  returnsClaim: string;
  returnsReality: string;
  summary: string;
  plainEnglish: string;
  explainLike15: string;
  redFlags: RedFlag[];
}

export interface InvestmentCharge {
  name: string;
  percentage: string;
  impact: string;
}

export interface LegalResult {
  documentType: string;
  sender: string;
  keyDates: string[];
  requiredActions: string[];
  consequences: string;
  summary: string;
  plainEnglish: string;
  explainLike15: string;
  redFlags: RedFlag[];
}

export interface GovernmentResult {
  policyName: string;
  authority: string;
  benefits: string[];
  eligibility: string[];
  howToApply: string[];
  summary: string;
  plainEnglish: string;
  explainLike15: string;
  redFlags: RedFlag[];
}

export type AnalysisResult =
  | { module: 'medical'; data: MedicalResult }
  | { module: 'banking'; data: BankingResult }
  | { module: 'insurance'; data: InsuranceResult }
  | { module: 'investment'; data: InvestmentResult }
  | { module: 'legal'; data: LegalResult }
  | { module: 'government'; data: GovernmentResult };

export interface UploadedDocument {
  id: string;
  fileName: string;
  fileType: string;
  uploadedAt: Date;
  extractedText?: string;
  documentType?: DocumentType;
  result?: AnalysisResult;
}
