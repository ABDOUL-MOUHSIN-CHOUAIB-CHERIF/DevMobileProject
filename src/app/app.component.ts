import { Component } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  wallet,
  analyticsOutline,
  shieldCheckmarkOutline,
  flashOutline,
  logInOutline,
  personAddOutline,
  trendingUpOutline,
  cashOutline,
  cardOutline,
  saveOutline,
  notificationsOutline,
  settingsOutline,
  helpCircleOutline,
  lockClosedOutline,
  mailOutline,
  callOutline,
  calendarOutline,
  timeOutline,
  checkmarkCircleOutline,
  closeCircleOutline,
  alertCircleOutline,
  arrowForwardOutline,
  arrowDownOutline,
  arrowUpOutline,
  arrowBackOutline,
  homeOutline,
  barChartOutline,
  pieChartOutline,
  documentTextOutline,
  cameraOutline,
  scanOutline,
  cloudUploadOutline,
  cloudDownloadOutline,
  trashOutline,
  createOutline,
  personOutline
} from 'ionicons/icons';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: true,
  imports: [IonApp, IonRouterOutlet],
})
export class AppComponent {
  
  // ✅ CORRECT: Constructor with addIcons inside
  constructor() {
    addIcons({
      wallet,
      'analytics-outline': analyticsOutline,
      'shield-checkmark-outline': shieldCheckmarkOutline,
      'flash-outline': flashOutline,
      'log-in-outline': logInOutline,
      'person-add-outline': personAddOutline,
      'trending-up-outline': trendingUpOutline,
      'cash-outline': cashOutline,
      'card-outline': cardOutline,
      'save-outline': saveOutline,
      'notifications-outline': notificationsOutline,
      'settings-outline': settingsOutline,
      'help-circle-outline': helpCircleOutline,
      'lock-closed-outline': lockClosedOutline,
      'mail-outline': mailOutline,
      'call-outline': callOutline,
      'calendar-outline': calendarOutline,
      'time-outline': timeOutline,
      'checkmark-circle-outline': checkmarkCircleOutline,
      'close-circle-outline': closeCircleOutline,
      'alert-circle-outline': alertCircleOutline,
      'arrow-forward-outline': arrowForwardOutline,
      'arrow-back-outline': arrowBackOutline,
      'home-outline': homeOutline,
      'bar-chart-outline': barChartOutline,
      'pie-chart-outline': pieChartOutline,
      'document-text-outline': documentTextOutline,
      'camera-outline': cameraOutline,
      'scan-outline': scanOutline,
      'cloud-upload-outline': cloudUploadOutline,
      'cloud-download-outline': cloudDownloadOutline,
      'trash-outline': trashOutline,
      'create-outline': createOutline,
      'person-outline': personOutline,
      'arrow-down-outline' : arrowDownOutline,
      'arrow-up-outline': arrowUpOutline
    });
  }
}