import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import {
  IonContent,
  IonCard,
  IonCardContent,
  IonItem,
  IonInput,
  IonLabel,
  IonButton,
  IonIcon
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonContent,
    IonCard,
    IonCardContent,
    IonItem,
    IonInput,
    IonLabel,
    IonButton,
    IonIcon
  ]
})
export class LoginPage {

  constructor(private router: Router) {}

  goToSignup() {
    this.router.navigate(['/signup']);
  }

  goToPassword() {
    this.router.navigate(['/forgot-password']);
  }

  goToDashboard() {
    this.router.navigate(['/dashboard']);
  }
}