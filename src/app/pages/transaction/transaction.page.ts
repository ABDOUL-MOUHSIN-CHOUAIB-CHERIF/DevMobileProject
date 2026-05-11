import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { addIcons } from 'ionicons';
import { 
  closeOutline, checkmarkCircleOutline, scanOutline, 
  chevronForwardOutline, restaurantOutline, cashOutline, 
  medicalOutline, swapHorizontalOutline, cartOutline, 
  addOutline, calendarOutline, timeOutline 
} from 'ionicons/icons';

import { DatabaseService } from '../../services/database';

@Component({
  selector: 'app-transaction',
  templateUrl: './transaction.page.html',
  styleUrls: ['./transaction.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class TransactionPage implements OnInit {

  // Data object to bind to the UI
  txData = {
    type: 'expense',
    amount: 0,
    category: 'Food',
    description: '',
    date: new Date().toISOString()
  };

  categories = [
    { name: 'Food', icon: 'restaurant-outline' },
    { name: 'Salary', icon: 'cash-outline' },
    { name: 'Health', icon: 'medical-outline' },
    { name: 'Transfer', icon: 'swap-horizontal-outline' },
    { name: 'Retail', icon: 'cart-outline' }
  ];

  constructor(
    private dbService: DatabaseService,
    private router: Router,
    private toastCtrl: ToastController
  ) {
    addIcons({
      closeOutline, checkmarkCircleOutline, scanOutline, 
      chevronForwardOutline, restaurantOutline, cashOutline, 
      medicalOutline, swapHorizontalOutline, cartOutline, 
      addOutline, calendarOutline, timeOutline
    });
  }

  ngOnInit() {
    // Set current time to local
    this.txData.date = new Date().toISOString();
  }

  setType(type: string) {
    this.txData.type = type;
  }

  setCategory(catName: string) {
    this.txData.category = catName;
  }

  async onSave() {
    // 1. Validation
    if (this.txData.amount <= 0) {
      this.showToast('Please enter a valid amount', 'warning');
      return;
    }

    // 2. Get current user from storage
    const session = localStorage.getItem('active_user');
    if (!session) {
      this.router.navigate(['/login']);
      return;
    }
    const user = JSON.parse(session);

    // 3. Prepare transaction object
    const newTx = {
      txId: crypto.randomUUID(),
      userId: user.id,
      type: this.txData.type,
      amount: this.txData.amount,
      category: this.txData.category,
      description: this.txData.description,
      date: this.txData.date
    };

    try {
      await this.dbService.addTransaction(newTx);
      this.showToast('Transaction saved successfully!', 'success');
      this.router.navigate(['/dashboard']);
    } catch (error) {
      this.showToast('Error saving to database', 'danger');
    }
  }

  goBack() {
    this.router.navigate(['/dashboard']);
  }

  async showToast(message: string, color: string) {
    const toast = await this.toastCtrl.create({
      message, duration: 2000, color, position: 'bottom'
    });
    await toast.present();
  }
}