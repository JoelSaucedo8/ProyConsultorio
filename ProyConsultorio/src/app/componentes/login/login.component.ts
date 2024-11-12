import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  documento: string = ''; 
  password: string = ''; 
  
  constructor(
    public dialogRef: MatDialogRef<LoginComponent>,
    private authService: AuthService,
    private router: Router
  ) {}

  iniciar() {
    const user = {
      usuario: this.documento,
      password: this.password
    };
    
    console.log(user);
    
    this.authService.login(user).subscribe((data: any) => {
      console.log(data);
  
      // Verifica que data.payload sea un array y que tenga al menos un elemento
      if (data?.payload && Array.isArray(data.payload) && data.payload.length > 0) {
        const userId = data.payload[0].id;
  
        // Almacena el token y el userId en localStorage
        localStorage.setItem('token', data.jwt);
        localStorage.setItem('userId', userId);
  
        // Cierra el diálogo y redirige a home-usuario
        this.dialogRef.close();
        this.router.navigate(['/home-usuario']);
      } else {
        console.error('El formato de respuesta es incorrecto o no contiene el ID de usuario.');
        // Aquí puedes mostrar un mensaje de error en la interfaz si es necesario
      }
    }, error => {
      console.error('Error en la solicitud de inicio de sesión:', error);
      // Maneja el error en caso de que la solicitud falle
    });
  }

  cerrar(){}
}