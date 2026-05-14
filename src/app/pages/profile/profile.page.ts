import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { addIcons } from 'ionicons';
import { 
  IonContent, 
  IonHeader, 
  IonIcon,
  IonButton,
  IonButtons, 
  IonTitle, 
  IonToolbar,
  IonAvatar,
  IonSegment,
  IonSegmentButton,
  IonLabel,
  IonToggle,
  IonTabBar,
  IonTabButton,
  IonFooter
} from '@ionic/angular/standalone';

import { 
  menuOutline, 
  settingsOutline, 
  languageOutline, 
  cashOutline, 
  cloudUploadOutline, 
  fingerPrintOutline, 
  shieldCheckmarkOutline, 
  lockClosedOutline, 
  helpCircleOutline, 
  documentTextOutline, 
  logOutOutline,
  walletOutline,
  trendingUpOutline,
  analyticsOutline,
  person,
  checkmarkCircle,
  chevronDown,
  chevronForward,
  openOutline
} from 'ionicons/icons';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule,
    IonContent, 
    IonHeader, 
    IonIcon,
    IonButton,
    IonButtons, 
    IonTitle, 
    IonToolbar,
    IonSegment,
    IonSegmentButton,
    IonLabel,
    IonToggle,
    IonTabBar,
    IonTabButton,
    IonFooter
  ]
})
export class ProfilePage implements OnInit {
  // Mock User Data matching your UI
  user = {
    name: 'Alex Sovereign',
    username: '@alex_vault_01',
    tier: 'Private Tier Member',
    email: 'a.sovereign@vault.com',
    memberSince: 'Oct 12, 2021',
    avatar: 'assets/images/avatar.png' 
  };

  language: string = 'en';
  baseCurrency: string = 'USD';
  biometricAuth: boolean = true;
  appVersion: string = '4.2.0-SOVEREIGN-VAULT';

  constructor() {
    addIcons({
      menuOutline,
      settingsOutline,
      languageOutline,
      cashOutline,
      cloudUploadOutline,
      fingerPrintOutline,
      shieldCheckmarkOutline,
      lockClosedOutline,
      helpCircleOutline,
      documentTextOutline,
      logOutOutline,
      walletOutline,
      trendingUpOutline,
      analyticsOutline,
      person,
      checkmarkCircle,
      chevronDown,
      chevronForward,
      openOutline
    });
  }

  ngOnInit() {}

  onLanguageChange(event: any) {
    this.language = event.detail.value;
    console.log('Language changed to:', this.language);
  }

  logout() {
    console.log('Logging out user...');
  }
}