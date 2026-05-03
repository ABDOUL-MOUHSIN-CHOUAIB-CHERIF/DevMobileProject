import { Component, OnInit } from '@angular/core';
<<<<<<< Updated upstream
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader,IonIcon, IonTitle, IonToolbar } from '@ionic/angular/standalone';
=======
import { CommonModule, DecimalPipe } from '@angular/common';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonIcon,
  IonContent,
  IonTabBar,
  IonTabButton,
} from '@ionic/angular/standalone';
//import { addIcons } from 'ionicons';
=======
import { IonContent, IonHeader,IonIcon,
         IonTitle, IonToolbar,
           IonButtons,
          IonButton, IonCardHeader,
          IonTabBar,
          IonTabButton, } from '@ionic/angular/standalone';
import { CommonModule, DecimalPipe } from '@angular/common';

import { addIcons } from 'ionicons';
>>>>>>> Stashed changes
import {
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
} from 'ionicons/icons';

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
<<<<<<< Updated upstream
=======

>>>>>>> Stashed changes

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
  standalone: true,
<<<<<<< Updated upstream
  //imports: [IonContent, IonHeader,IonIcon,   IonTitle, IonToolbar, CommonModule, FormsModule]

=======
>>>>>>> Stashed changes
  imports: [
    CommonModule,
    DecimalPipe,
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
<<<<<<< Updated upstream
=======

>>>>>>> Stashed changes
})
export class DashboardPage implements OnInit {

  // ── Wallet Data ──────────────────────────────────────────────────
  totalBalance  = 5_000_000;
  totalIncome   = 65_000;
  totalExpenses = 45_000;

  // ── Transactions ─────────────────────────────────────────────────
  transactions: Transaction[] = [
    {
      id: 1,
      name: 'Apple Store',
      category: 'Electronics',
      date: 'Today',
      amount: -650_000,
      icon: 'bag-outline',
      iconBg: 'bg-neutral',
      iconColor: '',
    },
    {
      id: 2,
      name: 'The Green Bistro',
      category: 'Dining',
      date: 'Yesterday',
      amount: -24_000,
      icon: 'restaurant-outline',
      iconBg: 'bg-expense',
      iconColor: '',
    },
    {
      id: 3,
      name: 'Salary Deposit',
      category: 'Income',
      date: '2 days ago',
      amount: 425_000,
      icon: 'cash-outline',
      iconBg: 'bg-income',
      iconColor: '',
    },
  ];

  constructor() {
    // Register all icons used in this page
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
    });
  }

  ngOnInit(): void {
    // Compute totals dynamically from the transactions list if needed
    this.recalcTotals();
  }

  // ── Helpers ──────────────────────────────────────────────────────

  /** Re-calculate income & expense totals from the transactions array. */
  recalcTotals(): void {
    this.totalIncome   = this.transactions
      .filter(t => t.amount > 0)
      .reduce((sum, t) => sum + t.amount, 0);

    this.totalExpenses = this.transactions
      .filter(t => t.amount < 0)
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);
  }

  // ── Actions ───────────────────────────────────────────────────────

  viewAll(): void {
    // Navigate to transactions list page
    console.log('Navigate to All Transactions');
  }

  openTransaction(tx: Transaction): void {
    // Navigate to transaction detail page or open modal
    console.log('Open transaction:', tx);
  }

  openScanner(): void {
    // Open QR code scanner
    console.log('Open QR scanner');
  }
}