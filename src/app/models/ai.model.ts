// models/ai.model.ts
export interface SpendingSummary {
  totalSpent: number;
  totalIncome: number;
  balance: number;
  categoryBreakdown: CategorySpending[];
  topExpenses: TopExpense[];
  savingsRate: number; 
}

export interface CategorySpending {
  category: string;
  amount: number;
  percentage: number;
  trend: 'up' | 'down' | 'stable';
}

export interface TopExpense {
  description: string;
  amount: number;
  date: Date;
}

export interface AIAdvice {
  id: string;
  userId: string;
  message: string;
  recommendation: string;
  potentialSavings?: number;
  createdAt: Date;
  isApplied: boolean;
}

export interface AIAnalysisRequest {
  spendingSummary: SpendingSummary;
  timeRange: 'weekly' | 'monthly' | 'yearly';
  previousData?: SpendingSummary;
}