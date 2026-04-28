// models/loan.model.ts
export type LoanType = 'given' | 'taken';
export type LoanStatus = 'pending' | 'active' | 'completed' | 'overdue';

export interface Loan {
  loanId: string;
  userId: string;
  creditor: string;  // Name of person/organization
  creditorPhone?: string;  // Optional contact
  principal: number;  // Original amount
  interestRate: number;  // Percentage (e.g., 5.5 for 5.5%)
  remainingBalance: number;
  dueDate: Date;
  type: LoanType;
  status: LoanStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface Repayment {
  repaymentId: string;
  loanId: string;
  amount: number;
  date: Date;
  notes?: string;
}

export interface LoanCalculation {
  totalInterest: number;
  totalToPay: number;
  monthlyPayment?: number;
  daysUntilDue: number;
}