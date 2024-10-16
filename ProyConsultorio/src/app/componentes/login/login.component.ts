import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;

  // Simulación de un usuario válido
  validUser = {
    username: 'usuarioValido',
    password: '123456'
  };


  constructor(private fb: FormBuilder, private router: Router) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onSubmit(): void {
    const { username, password } = this.loginForm.value;

    if (username === this.validUser.username && password === this.validUser.password) {
      // Si el usuario es válido, mostrar pop-up de éxito y redirigir a la siguiente página
      alert('Usuario válido. ¡Bienvenido!');
      this.router.navigate(['/next-page']); // Cambia '/next-page' por la ruta deseada
    } else {
      // Si las credenciales no son correctas, mostrar un mensaje de error
      alert('Usuario o contraseña incorrectos.');
    }
  }

  cancel(): void {
    this.loginForm.reset(); // Restablece el formulario
  }

  home() :void {
    this.router.navigate(['/']);
  }
}
