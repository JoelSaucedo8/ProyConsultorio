import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home-usuarios',
  templateUrl: './home-usuario.component.html',
  styleUrls: ['./home-usuario.component.css']
})
export class HomeUsuariosComponent {
  constructor(private router: Router) {} // Inyección del Router

  // Método para navegar a la página de inicio
  home(): void {
    this.router.navigate(['/']); // Cambia '/' por la ruta de tu página de inicio si es diferente
  }
}
