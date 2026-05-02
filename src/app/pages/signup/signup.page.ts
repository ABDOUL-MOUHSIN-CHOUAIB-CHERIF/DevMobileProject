import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router'
import { IonContent ,IonInput, IonLabel,  IonButton, IonText,  IonIcon} from '@ionic/angular/standalone';

@Component({
  selector: 'app-signup',
  templateUrl: 'signup.page.html',
  styleUrls: ['signup.page.scss'],
  standalone: true,
  imports: [IonContent, CommonModule,
             FormsModule, IonIcon,
            IonText, IonButton,
            IonLabel, IonInput]
})
export class SignupPage  {

  constructor(private router : Router) { }

   goToLogin() {
    this.router.navigate(['/login']);
  }

} 
