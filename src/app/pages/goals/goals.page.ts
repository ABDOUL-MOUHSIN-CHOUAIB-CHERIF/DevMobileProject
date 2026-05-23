import { Component, OnInit, ViewChild, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule  } from '@ionic/angular';
import { Router } from '@angular/router';
import { DatabaseService } from '../../services/database'; 

interface Goal {
  id?: number;
  userId: string;
  title: string;
  category: string;
  currentAmount: number;
  targetAmount: number;
  icon: string;
  colorClass: string;
  dueDate?: string;
}

@Component({
  selector: 'app-goal',
  templateUrl: './goals.page.html',
  styleUrls: ['./goals.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class GoalsPage implements OnInit {
  totalAssets = 0;
  userName: string = 'User';
  userId: string = '';
  
  // Array initialized empty - will fill from SQLite backend
  goals: Goal[] = [];

  // Form Model matching the ion-modal form fields
  newGoal: any = {
    title: '',
    category: '',
    targetAmount: 0,
    dueDate: ''
  };

  @ViewChild('goalModal') modal!: any;

  // Helper map to assign the proper icons and background classes based on chosen category
  categoryMeta: { [key: string]: { icon: string, class: string } } = {
    'Travel': { icon: 'airplane-outline', class: 'travel-card' },
    'Security': { icon: 'shield-checkmark-outline', class: 'security-card' },
    'Property': { icon: 'home-outline', class: 'property-card' },
    'Leisure': { icon: 'sparkles-outline', class: 'leisure-card' }
  };

  constructor(
    private router: Router,
    private dbService: DatabaseService // 👈 Inject your unified Database Service
  ) {}

  async ngOnInit(): Promise<void> {
    const session = localStorage.getItem('active_user');
    if (!session) {
      this.router.navigate(['/login']);
      return;
    }

    const user = JSON.parse(session);
    this.userName = user.name || 'User';
    this.userId = user.id || '';

    // Load goals from SQLite backend
    await this.loadUserGoals();
  }

  // 📥 FETCH FROM BACKEND (SQLite)
  async loadUserGoals() {
    try {
      const sql = `SELECT * FROM saving_goals WHERE userId = ?`;
      // selectQuery handles clean conversion to clean objects for both Web (sql.js) and Mobile
      const rows = await this.dbService.selectQuery(sql, [this.userId]);
      
      this.goals = rows;
 
      // Recalculate total assets dynamically based on user progress amounts
      this.totalAssets = this.goals.reduce((acc, goal) => acc + goal.currentAmount, 0);
    } catch (error) {
      console.error('[DB BackEnd] Failed to pull user goals:', error);
    }
  }

  //  WRITE TO BACKEND (SQLite)
  async saveGoal(): Promise<void> {
    // Basic verification
    if (!this.newGoal.title || !this.newGoal.category || this.newGoal.targetAmount <= 0) {
      console.warn('Invalid goal inputs.');
      return;
    }

    // Grab metadata configurations depending on select choice
    const meta = this.categoryMeta[this.newGoal.category] || { icon: 'star-outline', class: 'default-card' };

    try {
      const sql = `
          INSERT INTO saving_goals 
          (userId, title, category, currentAmount, targetAmount, dueDate) 
          VALUES (?, ?, ?, ?, ?, ?)
        `;
      
      const params = [
        this.userId,
        this.newGoal.title,
        this.newGoal.category,
        0, // New goals always start with 0 saved assets
        this.newGoal.targetAmount,
        // meta.icon,
        // meta.class,
        this.newGoal.dueDate || null
      ];

      // Execute insert statement
      await this.dbService.executeQuery(sql, params);
      console.log('[DB BackEnd] Goal successfully added! 🎉');

      // Close modal drawer and refresh view
      this.modal.dismiss();
      await this.loadUserGoals();

      // Reset form controls
      this.newGoal = { title: '', category: '', targetAmount: 0, dueDate: '' };

    } catch (error) {
      console.error('[DB BackEnd] Failed saving new goal entry:', error);
    }
  }

  getProgress(goal: Goal): number {
    if (!goal.targetAmount) return 0;
    const percentage = (goal.currentAmount / goal.targetAmount) * 100;
    return percentage > 100 ? 100 : percentage; // Clamp to 100 max
  }

  closeModal(): void {
    this.modal.dismiss();
  }

closeDateModal() {
  this.modal.dismiss();
}

  // Navigation handlers...
  gotoAnalytics(): void { this.router.navigate(['/analytics']); }
  gotoGoals(): void { this.router.navigate(['/goals']); }
  gotoProfile(): void { this.router.navigate(['/profile']); }
  gotoDashboard(): void { this.router.navigate(['/dashboard']); }
  openScanner(): void { this.router.navigate(['/transaction']); }
  logout(): void {
    localStorage.removeItem('active_user');
    this.router.navigate(['/login']);
  }
}