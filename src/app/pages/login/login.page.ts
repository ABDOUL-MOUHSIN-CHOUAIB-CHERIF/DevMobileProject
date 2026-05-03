// login.page.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { DatabaseService } from '../../services/database';
import { hasher } from '../../services/hasher';
import { ToastController, IonContent, IonCard, IonCardContent, IonItem, IonInput, IonLabel, IonButton, IonIcon } from '@ionic/angular/standalone';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonContent, IonCard, IonCardContent, IonItem, IonInput, IonLabel, IonButton, IonIcon]
})
export class LoginPage {

  constructor(
    private router: Router,
    private dbService: DatabaseService,
    private hasher: hasher,
    private toastCtrl: ToastController
  ) {}

  async onLogin(form: NgForm) {
    const { email, password } = form.value;

    try {
      // 1. Find user by email
      const user = await this.dbService.getUserByEmail(email);

      if (!user) {
        this.showToast('No account found with this email.', 'warning');
        return;
      }

      // 2. Compare the typed password with the stored hash
      // user.password is the hashed version from SQLite
      const isMatch = await this.hasher.comparePassword(password, user.password);

      if (isMatch) {
        this.showToast(`Welcome back, ${user.name}!`, 'success');
        
        // 3. Store "Session" (Simple version for now)
        localStorage.setItem('active_user', JSON.stringify({id: user.userId, name: user.name}));
        
        this.router.navigate(['/dashboard']);
      } else {
        this.showToast('Incorrect password.', 'danger');
      }

    } catch (error) {
      this.showToast('Login error. Please try again.', 'danger');
    }
  }

  async showToast(message: string, color: string) {
    const toast = await this.toastCtrl.create({
      message, duration: 2000, color, position: 'bottom'
    });
    await toast.present();
  }

  goToSignup() { this.router.navigate(['/signup']); }
  goToPassword() { this.router.navigate(['/forgot-password']); }
  goToDashboard() { this.router.navigate(['/dashboard']); }
}