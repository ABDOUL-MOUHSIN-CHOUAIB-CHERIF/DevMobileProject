// models/transaction.model.ts
export type TransactionType = 'income' | 'expense';

export type TransactionCategory = 
  | 'food'
  | 'transport'
  | 'health'
  | 'leisure'
  | 'salary'
  | 'business'
  | 'transfer'
  | 'other';

export interface Transaction {
  txId: string;
  userId: string;
  type: TransactionType;
  amount: number;
  category: TransactionCategory;
  description: string;
  date: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface DateRange {
  start: Date;
  end: Date;
}

export interface TransactionSummary {
  totalIncome: number;
  totalExpense: number;
  balance: number;
}