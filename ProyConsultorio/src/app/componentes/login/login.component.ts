import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service'; // Importar el servicio de autenticación

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  usuario: string = '';
  password: string = '';

  constructor(
    public dialogRef: MatDialogRef<LoginComponent>, 
    private router: Router,
    private authService: AuthService // Inyectar el servicio de autenticación
  ) {}

  async login(): Promise<void> { 
    try {
        console.log("Datos de login:", { usuario: this.usuario, password: this.password });

        // Llamada al servicio de autenticación
        this.authService.login(this.usuario, this.password).subscribe(
          (data) => {
            if (data.codigo === 200) {
              alert('Inicio de sesión exitoso');
              console.log("Datos del usuario:", data.payload);
              this.router.navigate(['/home-usuario']);
              this.close();
            } else {
              const errorMessage = data.mensaje || 'Error desconocido';
              alert('Error: ' + errorMessage);
            }
          },
          (error) => {
            console.error('Error en la solicitud de inicio de sesión:', error);
            alert('Error en la solicitud de inicio de sesión');
          }
        );
    } catch (error) {
        console.error('Error en el proceso de inicio de sesión:', error);
    }
  }

  close(): void {
    this.dialogRef.close();
  }
}
