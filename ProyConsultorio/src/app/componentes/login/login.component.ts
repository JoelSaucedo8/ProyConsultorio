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

  iniciar(): void {
    console.log('Intentando iniciar sesión...');
    this.authService.login(this.documento, this.password).subscribe(success => {
      if (success) {
        this.router.navigate(['/home-usuario']); // lleva a home-usuario
        this.close();
      } else {
        console.error('Error en las credenciales'); // Manejo de error
      }
    });
  }

  close(): void {
    this.dialogRef.close(); 
  }
}
