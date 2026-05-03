import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { addIcons } from 'ionicons';
import { 
    IonHeader,
    IonToolbar,
    IonTitle,
     IonCardHeader,
    IonContent,
    IonButtons,
    IonButton,
    IonTabBar,
    IonTabButton,
    IonIcon, } from '@ionic/angular/standalone';
import {notificationsOutline,arrowDownOutline,arrowUpOutline,sparklesOutline,warningOutline,trendingUpOutline,bagOutline,restaurantOutline,
        cashOutline, home, barChartOutline, qrCodeOutline, trophyOutline,} from 'ionicons/icons';
import { DatabaseService } from '../../services/database'; // Adjust path
import { Router } from '@angular/router';
export interface Transaction {
  id: number;
  name: string;
  category: string;
  date: string;
  amount: number;       // positive = income, negative = expense
  icon: string;
  iconBg: string;       // CSS class for icon background
  iconColor: string;    // CSS class for icon color
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonHeader,
    IonToolbar,
    IonTitle,
     IonIcon,
     IonCardHeader,
    IonContent,
    IonButtons,
    IonButton,
    IonTabBar,
    IonTabButton,
    IonIcon,
    
  ],
})
export class DashboardPage implements OnInit {
  userName: string = 'Guest';
  userId: string = '';
  
  totalBalance = 0;
  totalIncome = 0;
  totalExpenses = 0;
  transactions: any[] = [];

  constructor(
    private dbService: DatabaseService, 
    private router: Router
  ) {
    addIcons({ /* ... your icons ... */ });
  }

  async ngOnInit() {
    // 1. Check who is logged in
    const session = localStorage.getItem('active_user');
    if (!session) {
      this.router.navigate(['/login']);
      return;
    }

    const user = JSON.parse(session);
    this.userName = user.name;
    this.userId = user.id;

    // 2. Load Real Data
    await this.loadDashboardData();
  }

  async loadDashboardData() {
    // Fetch transactions from SQLite
    const data = await this.dbService.getTransactions(this.userId);
    
    // Map database fields to your UI interface
    this.transactions = data.map((tx: any) => ({
      id: tx.txId,
      name: tx.description || tx.category,
      category: tx.category,
      date: tx.date,
      amount: tx.type === 'expense' ? -tx.amount : tx.amount,
      icon: this.getIconForCategory(tx.category),
      iconBg: tx.type === 'expense' ? 'bg-expense' : 'bg-income'
    }));

    this.recalcTotals();
  }

  recalcTotals() {
    this.totalIncome = this.transactions
      .filter(t => t.amount > 0)
      .reduce((sum, t) => sum + t.amount, 0);

    this.totalExpenses = this.transactions
      .filter(t => t.amount < 0)
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);

    // Balance = Income - Expenses
    this.totalBalance = this.totalIncome - this.totalExpenses;
  }

  getIconForCategory(cat: string): string {
    const icons: any = {
      'food': 'restaurant-outline',
      'shopping': 'bag-outline',
      'salary': 'cash-outline',
      'transport': 'bus-outline'
    };
    return icons[cat.toLowerCase()] || 'help-circle-outline';
  }

  // ... rest of your actions (openScanner, etc.)
}