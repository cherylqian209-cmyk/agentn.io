export interface ForecastInputs {
  activeCustomers: number
  leadVolume: number
  qualificationRate: number
  replyRate: number
  meetingRate: number
  trialRate: number
  paidConversionRate: number
  averageRevenuePerCustomer: number
  monthlyChurnRate: number
  targetMrr: number
}

export interface AgentPerformance {
  name: string
  leadsGenerated: number
  repliesGenerated: number
  pipelineCreated: number
  customersWon: number
  revenueAttributed: number
}

export const forecastInputs: ForecastInputs = {
  activeCustomers: 84,
  leadVolume: 2400,
  qualificationRate: 0.34,
  replyRate: 0.11,
  meetingRate: 0.52,
  trialRate: 0.44,
  paidConversionRate: 0.3,
  averageRevenuePerCustomer: 185,
  monthlyChurnRate: 0.045,
  targetMrr: 50000,
}

export const forecastMonthlyBase = [
  { month: 'May' }, { month: 'Jun' }, { month: 'Jul' }, { month: 'Aug' },
  { month: 'Sep' }, { month: 'Oct' }, { month: 'Nov' }, { month: 'Dec' },
  { month: 'Jan' }, { month: 'Feb' }, { month: 'Mar' }, { month: 'Apr' },
]

export const agentPerformanceMock: AgentPerformance[] = [
  { name: 'LinkedIn Scout Agent', leadsGenerated: 920, repliesGenerated: 129, pipelineCreated: 48000, customersWon: 14, revenueAttributed: 25900 },
  { name: 'Email Outreach Agent', leadsGenerated: 1100, repliesGenerated: 158, pipelineCreated: 57500, customersWon: 17, revenueAttributed: 31450 },
  { name: 'Reddit Demand Miner', leadsGenerated: 640, repliesGenerated: 84, pipelineCreated: 29100, customersWon: 8, revenueAttributed: 14800 },
  { name: 'Website Visitor Agent', leadsGenerated: 530, repliesGenerated: 66, pipelineCreated: 21400, customersWon: 7, revenueAttributed: 12950 },
  { name: 'CRM Follow-up Agent', leadsGenerated: 480, repliesGenerated: 103, pipelineCreated: 36500, customersWon: 12, revenueAttributed: 22200 },
]
