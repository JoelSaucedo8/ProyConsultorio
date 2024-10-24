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

  constructor(private router: Router, private authService: AuthService) {} 

  openRegister(): void {
    this.isRegisterOpen = true;
  }

  closeRegister(): void {
    this.isRegisterOpen = false;
  }

  //valida campo y simula el envio de formulario 
  submitRegister(): void {
    if (!this.nombre || !this.apellido || !this.documento || !this.correo || !this.telefono || !this.password || !this.confirmPassword) {
      alert("Por favor, complete todos los campos.");
      return;
    }

    if (this.password !== this.confirmPassword) {
      alert("Las contraseñas no coinciden.");
      return;
    }

    const userData = {
      nombre: this.nombre,
      apellido: this.apellido,
      documento: this.documento,
      correo: this.correo,
      telefono: this.telefono,
      password: this.password
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
        this.closeRegister(); // cierre registro exitoso
      }
    });
  }

  // vuelve a pag de inicio
  home(): void {
    this.router.navigate(['/']);
  }
}
