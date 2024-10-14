import { Component } from '@angular/core';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  isRegisterOpen = false;
  nombre: string = '';
  apellido: string = '';
  documento: string = '';
  correo: string = '';
  telefono: string = '';
  password: string = '';
  confirmPassword: string = '';

  // Abrir modal de registro
  openRegister() {
    this.isRegisterOpen = true;
  }

  // Cerrar modal de registro
  closeRegister() {
    this.isRegisterOpen = false;
  }

  // Simular envío de formulario de registro
  submitRegister() {
    console.log("Formulario de registro enviado");
    this.closeRegister();
  }
}
