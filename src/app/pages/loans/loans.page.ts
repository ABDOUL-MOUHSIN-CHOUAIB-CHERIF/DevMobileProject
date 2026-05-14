import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { 
  notifications,
  trendingUpOutline,
  addOutline,
  personAddOutline,
  alertCircleOutline,
  cashOutline,
  checkmarkCircleOutline,
  arrowForwardOutline,
  scanOutline,
  homeOutline,
  analyticsOutline,
  trophyOutline,
  receiptOutline
} from 'ionicons/icons';

interface LedgerItem {
  id: number;
  name: string;
  avatar?: string;
  initials?: string;
  type: 'Lent Out' | 'Borrowed';
  amount: number;
  date: string;
  status: 'OVERDUE' | 'PENDING' | 'PAID';
  statusClass: string;
}

@Component({
  selector: 'app-loans',
  templateUrl: 'loans.page.html',
  styleUrls: ['./loans.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule]
})
export class LoansPage implements OnInit {
  totalCreditExposure: number = 142850.00;
  lentOutAmount: number = 92400;
  borrowedAmount: number = 50450;
  
  filterSegment: string = 'all';

  ledgerItems: LedgerItem[] = [
    {
      id: 1,
      name: 'Elena Vance',
      avatar: 'https://ionicframework.com/docs/img/demos/avatar.svg',
      type: 'Lent Out',
      amount: 12500.00,
      date: 'Due Oct 24, 2023',
      status: 'OVERDUE',
      statusClass: 'status-overdue'
    },
    {
      id: 2,
      name: 'Marcus Thorne',
      avatar: 'https://ionicframework.com/docs/img/demos/avatar.svg',
      type: 'Borrowed',
      amount: 45000.00,
      date: 'Due Jan 15, 2024',
      status: 'PENDING',
      statusClass: 'status-pending'
    },
    {
      id: 3,
      name: 'Alina Sterling',
      initials: 'AS',
      type: 'Lent Out',
      amount: 8000.00,
      date: 'Cleared Nov 02, 2023',
      status: 'PAID',
      statusClass: 'status-paid'
    }
  ];

  constructor() {
    addIcons({
      notifications,
      trendingUpOutline,
      addOutline,
      personAddOutline,
      alertCircleOutline,
      cashOutline,
      checkmarkCircleOutline,
      arrowForwardOutline,
      scanOutline,
      homeOutline,
      analyticsOutline,
      trophyOutline,
      receiptOutline
    });
  }

  ngOnInit() {}

  segmentChanged(event: any) {
    this.filterSegment = event.detail.value;
  }

  sendReminder(name: string) {
    console.log(`Sending reminder to ${name}...`);
  }

  payNow(name: string) {
    console.log(`Initiating payment execution window for ${name}...`);
  }

  viewReceipt() {
    console.log('Opening encrypted secure invoice ledger...');
  }

  openCameraBridge() {
    console.log('Launching camera engine QR target subsystem...');
  }
}