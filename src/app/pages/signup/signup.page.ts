// signup.page.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { IonContent, IonInput, IonLabel, IonButton, IonText, IonIcon, ToastController } from '@ionic/angular/standalone';
import { DatabaseService } from '../../services/database'; // Adjust path
import { hasher } from '../../services/hasher'; // Adjust path

@Component({
  selector: 'app-signup',
  templateUrl: 'signup.page.html',
  styleUrls: ['signup.page.scss'],
  standalone: true,
  imports: [IonContent, CommonModule, FormsModule, IonIcon, IonText, IonButton, IonLabel, IonInput]
})
export class SignupPage {

  constructor(
    private router: Router,
    private dbService: DatabaseService,
    private hasher: hasher,
    private toastCtrl: ToastController
  ) { }

  async onSignUp(form: NgForm) {
    const { fullName, email, password, confirmPassword } = form.value;

    // 1. Basic Validation
    if (password !== confirmPassword) {
      this.showToast('Passwords do not match!', 'danger');
      return;
    }
       
    try {
      // 2. Hash the password
      const securePassword = await this.hasher.hashPassword(password);

      // 3. Create User Object
      const newUser = {
        userId: crypto.randomUUID(),
        email: email.toLowerCase(),
        password: securePassword,
        name: fullName,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      // 4. Save to SQLite
      await this.dbService.addUser(newUser);

      this.showToast('Vault Created Successfully!', 'success');
      
      // 5. Navigate to Login or Dashboard
      this.router.navigate(['/login']);

    } catch (error: any) {
      if (error.message.includes('UNIQUE constraint failed')) {
        this.showToast('This email is already registered.', 'warning');
      } else {
        this.showToast('Error creating account. Try again.', 'danger');
      }
    }
  }

  async showToast(message: string, color: string) {
    const toast = await this.toastCtrl.create({
      message,
      duration: 3000,
      color,
      position: 'bottom'
    });
    await toast.present();
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }
}