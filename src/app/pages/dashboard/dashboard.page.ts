import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { addIcons } from 'ionicons';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, 
        IonButton,  IonTabBar,  IonTabButton,  IonIcon, IonCardHeader } from '@ionic/angular/standalone';

import {notificationsOutline,arrowDownOutline,arrowUpOutline,sparklesOutline,warningOutline,trendingUpOutline,bagOutline,restaurantOutline,
        cashOutline,home,barChartOutline,qrCodeOutline,trophyOutline,busOutline,helpCircleOutline } from 'ionicons/icons';

import { DatabaseService } from '../../services/database';

export interface Transaction {
  id: string | number;
  name: string;
  category: string;
  date: string;
  amount: number;
  icon: string;
  iconBg: string;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonIcon,
    IonCardHeader,
    IonContent,
    IonButtons,
    IonButton,
    IonTabBar,
    IonTabButton
  ],
})
export class DashboardPage implements OnInit {
  // ── User Data ──
  userName: string = 'User';
  userId: string = '';

  // ── Wallet Data ──
  totalBalance = 0;
  totalIncome = 0;
  totalExpenses = 0;

  // ── Transactions List ──
  transactions: Transaction[] = [];

  constructor(
    private dbService: DatabaseService,
    private router: Router
  ) {
    // Register all icons used in the dashboard
    addIcons({
      notificationsOutline,
      arrowDownOutline,
      arrowUpOutline,
      sparklesOutline,
      warningOutline,
      trendingUpOutline,
      bagOutline,
      restaurantOutline,
      cashOutline,
      home,
      barChartOutline,
      qrCodeOutline,
      trophyOutline,
      busOutline,
      helpCircleOutline
    });
  }

  async ngOnInit(): Promise<void> {
    // 1. Check Authentication Session
    const session = localStorage.getItem('active_user');
    if (!session) {
      this.router.navigate(['/login']);
      return;
    }

    const user = JSON.parse(session);
    this.userName = user.name;
    this.userId = user.id;

    // 2. Load Real Data from SQLite
    await this.loadDashboardData();
  }

  /** Fetches transactions from DB and maps them to the UI format */
  async loadDashboardData(): Promise<void> {
    try {
      const data = await this.dbService.getTransactions(this.userId);

      if (data && data.length > 0) {
        this.transactions = data.map((tx: any) => ({
          id: tx.txId,
          name: tx.description || tx.category,
          category: tx.category,
          date: tx.date,
          // Convert type to positive/negative for UI coloring
          amount: tx.type === 'expense' ? -tx.amount : tx.amount,
          icon: this.getIconForCategory(tx.category),
          iconBg: tx.type === 'expense' ? 'bg-expense' : 'bg-income'
        }));
      } else {
        this.transactions = []; // Empty state
      }

      this.recalcTotals();
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    }
  }

  /** Re-calculate income, expense, and balance totals */
  recalcTotals(): void {
    this.totalIncome = this.transactions
      .filter(t => t.amount > 0)
      .reduce((sum, t) => sum + t.amount, 0);

    this.totalExpenses = this.transactions
      .filter(t => t.amount < 0)
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);

    this.totalBalance = this.totalIncome - this.totalExpenses;
  }

  /** Helper to assign icons based on category string */
  getIconForCategory(cat: string): string {
    const categoryMap: { [key: string]: string } = {
      'electronics': 'bag-outline',
      'shopping': 'bag-outline',
      'dining': 'restaurant-outline',
      'food': 'restaurant-outline',
      'income': 'cash-outline',
      'salary': 'cash-outline',
      'transport': 'bus-outline',
      'travel': 'bus-outline'
    };
    return categoryMap[cat.toLowerCase()] || 'help-circle-outline';
  }

  // ── UI Actions ──

  viewAll(): void {
    this.router.navigate(['/transactions-history']);
  }

  openTransaction(tx: Transaction): void {
    console.log('Viewing details for:', tx.name);
  }

  openScanner(): void {
    console.log('Initiating QR Scanner...');
  }

  logout(): void {
    localStorage.removeItem('active_user');
    this.router.navigate(['/login']);
  }
}