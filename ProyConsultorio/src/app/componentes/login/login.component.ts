import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  template: `
    <button (click)="login('admin')">Login as Admin</button>
    <button (click)="login('operador')">Login as Oprerador</button>
    <button (click)="login('paciente')">Login as Paciente</button>
    <button (click)="login('medico')">Login as Medico</button>
    <button (click)="login('guest')">Login as Guest</button>
  `
})
export class LoginComponent {
  username: string = '';
  password: string = '';

  constructor(public dialogRef: MatDialogRef<LoginComponent>, private authService: AuthService, private router: Router) {}

  login(role: string): void {
    this.authService.login(role);
    this.router.navigate([`/${role}`]);
  }

  close(): void {
    this.dialogRef.close();
  }

  iniciar(): void {
    // Simulación de autenticación básica (puedes reemplazarla con autenticación real)
    if (this.username === 'admin' && this.password === 'adminpass') {
      this.authService.login('admin');  // Asignar rol 'admin'
      this.dialogRef.close();
      this.router.navigate(['/admin']);  // Redirigir a la página de administrador
    } else if (this.username === 'operador' && this.password === 'operadorpass') {
      this.authService.login('operador');  // Asignar rol 'operador'
      this.dialogRef.close();
      this.router.navigate(['/operador']);  // Redirigir a la página de usuario
    } else if (this.username === 'medico' && this.password === 'medicopass') {
      this.authService.login('medico'); // Asignar rol 'medico'
      this.dialogRef.close();
      this.router.navigate(['/medico']); // Redirigir a la página de usuario
    } else if (this.username === 'paciente' && this.password === 'pacientepass'){
      this.authService.login('paciente'); // Asignar rol 'paciente'
      this.dialogRef.close();
      this.router.navigate(['/paciente']) // Redirigir a la página de paciente
    } else {
      this.authService.login('guest');  // Asignar rol 'guest'
      this.dialogRef.close();
      this.router.navigate(['/guest']);  // Redirigir a la página de invitado
    }
  }
}
