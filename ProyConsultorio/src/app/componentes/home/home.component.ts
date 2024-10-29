import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Observable } from 'rxjs';
import { MatDialog } from '@angular/material/dialog'; // Asegúrate de importar MatDialog
import { LoginComponent } from '../login/login.component'; // Importa el componente de login

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent {
  isLoggedIn$: Observable<boolean>;
  currentProfessionalIndex: number = 0; // Índice del profesional actual

  professionals = [
    {
      name: 'Dr. Juan Pérez',
      specialty: '- Cardiólogo',
      description: `Lo que más me gusta de mi profesión es poder ayudar a mis pacientes a mejorar su calidad
       de vida`,
      image: 'assets/imagenes/doctor1.jpeg',
    },
    {
      name: 'Dra. Ana Lopez',
      specialty: '- Pediatra',
      description: `Lo que más me gusta de mi profesión es poder acompañar a los niños y sus familias`,
      image: 'assets/imagenes/doctor2.jpeg',
    },
    {
      name: 'Dra. María González',
      specialty: '- Dermatóloga',
      description: `Mi pasión por la dermatología me permite ayudar a mis pacientes `,
      image: 'assets/imagenes/doctor3.jpg',
    }
  ];
home: any;

  constructor(private authService: AuthService, private dialog: MatDialog) { // Inyecta MatDialog
    this.isLoggedIn$ = this.authService.isLoggedIn$;
  }

  // Método para abrir el diálogo de inicio de sesión
  openLoginDialog(): void {
    const dialogRef = this.dialog.open(LoginComponent, {
      width: '300px', // Ajusta el tamaño del diálogo según sea necesario
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('El diálogo de login fue cerrado');
    });
  }

  // Cambiar al siguiente profesional
  nextProfessional(): void {
    this.currentProfessionalIndex = (this.currentProfessionalIndex + 1) % this.professionals.length;
  }

  // Cambiar al profesional anterior
  previousProfessional(): void {
    this.currentProfessionalIndex = (this.currentProfessionalIndex - 1 + this.professionals.length) % this.professionals.length;
  }
}