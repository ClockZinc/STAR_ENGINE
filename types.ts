
export enum AIRole {
  LEGAL_ARCHITECT = 'LEGAL_ARCHITECT',
  CREATIVE_DIRECTOR = 'CREATIVE_DIRECTOR',
  MARKETING_STRATEGIST = 'MARKETING_STRATEGIST'
}

export enum SystemRole {
  VOLUNTEER = 'VOLUNTEER',   // 志愿者：采集灵感
  LAWYER = 'LAWYER',         // 律师：合规审计
  MERCHANT = 'MERCHANT',     // 商会：商业联名
  ADMIN = 'ADMIN'            // 管理员/指挥官
}

export interface User {
  id: string;
  nickname: string;
  avatar: string;
  role: SystemRole;
  isVerified: boolean;
}

export enum AssetWorkflowStatus {
  RAW = 'RAW',               
  ENHANCED = 'ENHANCED',     
  THREE_D_GEN = 'THREE_D_GEN', 
  ALGORITHMIC = 'ALGORITHMIC',
  LEGAL_LOCKED = 'LEGAL_LOCKED',
  CONTRACTED = 'CONTRACTED', 
  DISTRIBUTING = 'DISTRIBUTING',
  FROZEN = 'FROZEN' 
}

export interface IPAsset {
  id: string;
  title: string;
  creator: string;
  type: 'image' | 'text' | 'pdf' | '3d_model';
  status: AssetWorkflowStatus;
  date: string;
  preview?: string;
  audioUrl?: string; // Star Voice BGM
  emotionTags?: string[]; // AI analyzed emotions
  threeDModelUrl?: string; 
  royaltySplit: string;
  legalHash?: string;
  copyrightOwner: 'Creator/Guardian' | 'Welfare Account';
  licensee?: string;
}

export interface PhysicalItem {
  id: string;
  nfcUuid: string;
  assetId: string;
  batchNumber: string;
  isSold: boolean;
  totalContribution: number; // Dignity Fund contributed
  ownerNickname?: string;
}

export interface PartnerSubscription {
  id: string;
  companyName: string;
  artistId: string;
  status: 'active' | 'paused' | 'expired';
  planType: 'Pro' | 'Enterprise';
  mrr: number;
  nextBillingDate: string;
}

export interface AudioGenerationResult {
  audioParameters: {
    mood: string;
    tempo: string;
    instruments: string[];
  };
  narrativeDescription: string;
}

export interface SocialImpactMetric {
  familySupportHours: number;
  royaltyCollectionRate: number;
  socialPerceptionShift: number; 
  exposureQualityScore: number; 
}

export interface LegalAnalysisResult {
  complianceScore: number;
  keyTerms: string[];
  risks: string[];
  suggestions: string;
  redLineViolations: string[]; 
  isSafeForVulnerableGroups: boolean;
}

export interface ImpactReportResult {
  reportDate: string;
  metrics: SocialImpactMetric;
  narrativeSummary: string;
  crisisFundStatus: string;
}

export interface CreativePromptResult {
  visualStyle: string;
  storyAngle: string;
  prompts: string[];
}

export interface ArtStoryResult {
  title: string;
  narrative: string;
  tags: string[];
  commercialPotential: string;
}

export interface StyleAlgorithmResult {
  algorithmName: string;
  visualDNA: string;
  philosophy: string;
  implementationGuide: string;
}

export interface LicensingStrategyResult {
  modelName: string;
  entryFeeSuggestion: string;
  royaltyRate: string;
  legalProtectionFocus: string;
  marketingHook: string;
  isStyleLicensing?: boolean;
}

export interface MarketingScriptResult {
  platform: string;
  hook: string;
  body: string;
  hashtags: string[];
  redLineCheck: {
    passed: boolean;
    detectedWords: string[];
    fixSuggestion: string;
  };
}
