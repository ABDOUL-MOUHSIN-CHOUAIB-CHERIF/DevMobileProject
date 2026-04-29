import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
// import { IonicModule } from '@ionic/angular/standalone';  // ← Use standalone
import { Router } from '@angular/router';
import { IonContent,IonButtons,IonCardContent, IonCard,IonCardHeader,IonCardTitle,  IonHeader, IonTitle, IonToolbar, IonBadge, IonButton , IonItem, IonIcon, IonLabel} from '@ionic/angular/standalone';

@Component({
  selector: 'app-home',
  templateUrl:'./home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, 
    IonTitle, IonToolbar, CommonModule,
    IonBadge,IonButton,IonIcon,IonLabel,
     IonItem,FormsModule,  
     IonButtons, IonCard,
    IonCardTitle, IonCardHeader, IonCardContent]
    // schemas: [CUSTOM_ELEMENTS_SCHEMA] 
})
export class HomePage  {

 constructor(private router: Router) {}
  
  goToLogin() {
    this.router.navigate(['/login']);
  }
  
  goToRegister() {
    this.router.navigate(['/signup']);
  }

}
