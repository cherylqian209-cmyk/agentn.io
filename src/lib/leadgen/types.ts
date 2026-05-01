export type LeadGenICP = {
  productDescription: string;
  targetCustomer: string;
  industry?: string;
  geography?: string;
  companySize?: string;
  buyingSignals: string[];
  exclusions: string[];
  desiredCount: number;
  sourceUrls: string[];
  recurrence: 'one-time' | 'daily' | 'weekly' | 'monthly';
};

export type LeadRecord = {
  id: string;
  companyName: string;
  website?: string;
  contactName?: string;
  role?: string;
  email?: string;
  socialUrl?: string;
  sourceUrl: string;
  sourceTitle?: string;
  evidenceSnippet: string;
  buyingSignals: string[];
  fitScore: number;
  scoreGrade: 'A+' | 'A' | 'B' | 'Reject';
  suggestedAngle: string;
  personalizedOpener: string;
  confidence: number;
  extractedAt: string;
};

export type LeadArtifact = {
  type: 'lead_generation';
  icp: LeadGenICP;
  leads: LeadRecord[];
  summary: {
    requested: number;
    found: number;
    qualified: number;
    averageFitScore: number;
    sourcesUsed: number;
  };
};

export type LeadProof = {
  sourceUrls: string[];
  successfulFetchCount: number;
  failedFetchCount: number;
  leadsFound: number;
  qualifiedLeads: number;
  validationChecks: string[];
  proofHash: string;
  sampleMode: boolean;
};
