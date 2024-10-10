import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  registerForm: FormGroup;

  constructor(private fb: FormBuilder, private router: Router) {
    // Inicializamos el formulario con validaciones
    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      apellido: ['', Validators.required],
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    });
  }

  goToRedirige() {
    this.router.navigate(['home']);
  }

  // Método para enviar el formulario
  onSubmit() {
    if (this.registerForm.valid) {
      // Aquí podrías procesar el formulario (enviar a un servidor, etc.)
      console.log('Formulario válido, datos:', this.registerForm.value);
    } else {
      console.log('Formulario inválido');
    }
  }
}
