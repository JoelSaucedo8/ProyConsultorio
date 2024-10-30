import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

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
    private authService: AuthService
  ) {}

  iniciar(): void {
    console.log('Intentando iniciar sesión...');
    this.authService.login(this.usuario, this.password).subscribe(response => {
        console.log('Respuesta del servidor:', response); // Agrega un log para ver la respuesta completa
        if (response.codigo === 200) { // Verifica el código de respuesta
            // Si el código es 200, significa que el inicio de sesión fue exitoso
            console.log('Inicio de sesión exitoso:', response);
            // Aquí puedes obtener otras propiedades de la respuesta, si las hay
            this.router.navigate(['/home-usuario']);
            this.close();
        } else {
            console.error('Error en las credenciales:', response.mensaje); // Manejo de error
        }
    }, error => {
        console.error('Error en la solicitud de inicio de sesión:', error);
        alert('Error en la solicitud de inicio de sesión');
    });
}
  

  close(): void {
    this.dialogRef.close();
  }
}
