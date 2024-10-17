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
  username: string = '';
  password: string = '';

  constructor(
    public dialogRef: MatDialogRef<LoginComponent>,
    private authService: AuthService,
    private router: Router
  ) {}

  iniciar(): void {
    this.authService.login(this.username, this.password).subscribe(success => {
      if (success) {
        this.dialogRef.close(); // Cierra el diálogo
        const role = this.authService.getRole(); // Obtiene el rol del usuario logueado
        if (role) {
          this.router.navigate([`/${role}`]); // Redirige según el rol
        } else {
          console.error('Rol no encontrado');
        }
      } else {
        // Aquí puedes manejar el error si el login falla
        console.error('Login failed');
      }
    });
  }

  close(): void {
    this.dialogRef.close();
  }
}
