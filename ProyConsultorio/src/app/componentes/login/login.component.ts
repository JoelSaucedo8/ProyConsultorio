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

  constructor(private fb: FormBuilder, private router: Router) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onSubmit(): void {
    const username = this.loginForm.get('username')?.value;
    const password = this.loginForm.get('password')?.value;

    //validacion de usuario
    if (username === 'usuarioValido' && password === '1234') {
      alert('Usuario válido'); //pop-up
      this.router.navigate(['/next-page']); //usuario correcto, da acceso a la pag
    } else {
      alert('Usuario o contraseña inválidos'); //pop-up de error
    }
  }

  cancel(): void {
    this.loginForm.reset(); //reinicio de formulario si se cancela
  }
}
