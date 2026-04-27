import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router'
import { IonContent, IonButton, IonText, IonIcon } from '@ionic/angular/standalone';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonContent, IonButton, IonText, IonIcon, CommonModule, FormsModule]
})
export class LoginPage implements OnInit {

  constructor(private router : Router) { }

   goToLRegister() {
    this.router.navigate(['/signup']);
  }
  ngOnInit() {
  }

}
