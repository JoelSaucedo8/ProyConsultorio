import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent {
  isLoggedIn$: Observable<boolean>;

  constructor(private authService: AuthService) {
    this.isLoggedIn$ = this.authService.isLoggedIn$; 
  }

  openLoginPopup(): void {
    // Puedes implementar la lógica aquí si decides abrir un pop-up de inicio de sesión más adelante.
  }

  navigateToRegister(): void {
    // Implementa la lógica para navegar al registro.
  }
}
