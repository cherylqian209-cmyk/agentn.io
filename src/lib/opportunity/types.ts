export type OpportunityScanInput = {
  websiteUrl?: string;
  companyName?: string;
  businessDescription: string;
  offerDescription: string;
  targetCustomer?: string;
  pricePoint?: string;
  primaryGoal: 'leads' | 'users' | 'bookings' | 'replies' | 'sales';
  preferredChannels: string[];
  geography?: string;
  notes?: string;
};

export type Opportunity = {
  id: string;
  name: string;
  type: 'company' | 'person' | 'community' | 'directory' | 'search_query';
  whyRelevant: string;
  suggestedAngle: string;
  confidenceScore: number;
  sourceHint: string;
};

export type OutreachDraft = {
  id: string;
  subject: string;
  body: string;
  personalizationAngle: string;
  callToAction: string;
};

export type AcquisitionChannel = {
  id: string;
  name: string;
  whyItFits: string;
  difficulty: 'low' | 'medium' | 'high';
  expectedUpside: 'low' | 'medium' | 'high';
  firstAction: string;
};

export type OpportunityReport = {
  id: string;
  createdAt: string;
  input: OpportunityScanInput;
  businessSummary: string;
  recommendedICP: {
    segmentName: string;
    painPoint: string;
    buyingTrigger: string;
    willingnessToPay: string;
    whyNow: string;
  };
  channels: AcquisitionChannel[];
  opportunities: Opportunity[];
  outreachDrafts: OutreachDraft[];
  workflowSteps: string[];
  revenueEstimate: {
    conservative: string;
    moderate: string;
    upside: string;
    assumptions: string[];
  };
};
