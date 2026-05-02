// models/notification.model.ts
export type NotificationType = 
  | 'deficit_alert'
  | 'savings_completion'
  | 'loan_reminder'
  | 'ai_advice'
  | 'backup_complete'
  | 'general';

export interface Notification {
  notifId: string;
  userId: string;
  message: string;
  type: NotificationType;
  createdAt: Date;
  read: boolean;
  data?: any;  // Additional data (e.g., loanId, goalId)
} 

export interface NotificationPreferences {
  userId: string;
  enablePushNotifications: boolean;
  enableEmailNotifications: boolean;
  deficitAlerts: boolean;
  loanReminders: boolean;
  savingsAlerts: boolean;
  aiAdvices: boolean;
}