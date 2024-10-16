import { Component } from '@angular/core';
import { Router } from '@angular/router'; // Importar Router

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

  constructor(private router: Router) {} // Inyección del Router

  // Abre el modal
  openRegister(): void {
    this.isRegisterOpen = true;
  }

  // Cierra el modal de registro
  closeRegister(): void {
    this.isRegisterOpen = false;
  }

  // Valida el campo y simula el envío de formulario 
  submitRegister(): void {
    if (!this.nombre || !this.apellido || !this.documento || !this.correo || !this.telefono || !this.password || !this.confirmPassword) {
      alert("Por favor, complete todos los campos.");
      return;
    }

    if (this.password !== this.confirmPassword) {
      alert("Las contraseñas no coinciden.");
      return;
    }

    console.log("Formulario de registro enviado");
    alert("Registro exitoso");
    this.closeRegister(); // Cierra el modal después de un registro exitoso
  }

  // Navega a la página de inicio
  home(): void {
    this.router.navigate(['/']);
  }
}
