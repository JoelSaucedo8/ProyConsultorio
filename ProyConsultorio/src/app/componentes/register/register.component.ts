import { Component } from '@angular/core';
import { Router } from '@angular/router'; 
import { AuthService } from 'src/app/services/auth.service'; 
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  isRegisterOpen: boolean = false;
  nombre: string = '';
  apellido: string = '';
  documento: string = '';
  correo: string = '';
  telefono: string = '';
  password: string = '';
  confirmPassword: string = '';
navigateToHome: any;

  constructor(private router: Router, private authService: AuthService) {} 

  openRegister(): void {
    this.isRegisterOpen = true;
  }

  closeRegister(): void {
    this.isRegisterOpen = false;
  }

  // Valida campo y simula el envío de formulario 
  submitRegister(): void {
    if (!this.nombre || !this.apellido || !this.documento || !this.correo || !this.telefono || !this.password || !this.confirmPassword) {
      alert("Por favor, complete todos los campos.");
      return;
    }

    if (this.password !== this.confirmPassword) {
      alert("Las contraseñas no coinciden.");
      return;
    }

    // Crear el objeto userData con los campos correctos
    const userData = {
      dni: this.documento, 
      apellido: this.apellido,
      nombre: this.nombre,
      fecha_nacimiento: '', 
      password: this.password,
      rol: '', 
      email: this.correo,
      telefono: this.telefono
    };

    this.authService.register(userData).pipe(
      catchError(err => {
        console.error('Error en el registro:', err);
        alert('Error al registrar. Inténtalo nuevamente.');
        return of(null);
      })
    ).subscribe((response: any) => {
      if (response) {
        console.log("Formulario de registro enviado");
        alert("Registro exitoso");
        this.closeRegister(); 
        this.router.navigate(['/home-usuario']); 
      }
    });
  }

  // Vuelve a la página de inicio
  home(): void {
    this.router.navigate(['/']);
  }
}
