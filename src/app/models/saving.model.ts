// models/savings.model.ts
export interface SavingsGoal {
  goalId: string;
  userId: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Contribution {
  contributionId: string;
  goalId: string;
  amount: number;
  date: Date;
}

export interface SavingsProgress {
  goalId: string;
  progressPercentage: number;
  remainingAmount: number;
  isCompleted: boolean;
}