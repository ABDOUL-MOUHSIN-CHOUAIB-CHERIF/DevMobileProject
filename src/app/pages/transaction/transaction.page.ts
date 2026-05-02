import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { 
  closeOutline, checkmarkCircleOutline, scanOutline, 
  chevronForwardOutline, restaurantOutline, cashOutline, 
  medicalOutline, swapHorizontalOutline, cartOutline, 
  addOutline, calendarOutline, timeOutline 
} from 'ionicons/icons';

@Component({
  selector: 'app-transaction',
  templateUrl: './transaction.page.html',
  styleUrls: ['./transaction.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
// Fix: Added the space here between the class name and 'implements'
export class TransactionPage implements OnInit {

  constructor() {
    addIcons({
      closeOutline, checkmarkCircleOutline, scanOutline, 
      chevronForwardOutline, restaurantOutline, cashOutline, 
      medicalOutline, swapHorizontalOutline, cartOutline, 
      addOutline, calendarOutline, timeOutline
    });
  }

  ngOnInit() {}
} // Ensure there is a closing brace here for the class