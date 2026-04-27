import { Component } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: true,  // ← Add this
  imports: [IonApp, IonRouterOutlet],  // ← Remove IonicModule.forRoot()
})
export class AppComponent {
  constructor() {}
}