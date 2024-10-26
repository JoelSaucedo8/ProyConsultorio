import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  registerForm: FormGroup;

  constructor(private fb: FormBuilder, 
              private dataService: DataService, 
              private router: Router) {
    
    // Crear el formulario con validaciones
    this.registerForm = this.fb.group({
      dni: ['', Validators.required],
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      fecha_nacimiento: ['', Validators.required],
      telefono: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, {
      validator: this.passwordMatchValidator // Validación personalizada para comparar contraseñas
    });
  }

  // Validador personalizado para confirmar que las contraseñas coincidan
  passwordMatchValidator(form: FormGroup): any {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { mismatch: true };
  }

  // Método para redirigir
  goToRedirige() {
    this.router.navigate(['home']);
  }

  // Método para enviar el formulario
  onSubmit(): void {
    this.registerForm.markAllAsTouched();
    if (this.registerForm.valid) {

      const newUser = {
        dni: this.registerForm.value.dni,
        apellido: this.registerForm.value.apellido,
        nombre: this.registerForm.value.nombre,
        fecha_nacimiento: this.registerForm.value.fecha_nacimiento,
        password: this.registerForm.value.password,
        rol: 'paciente',
        email: this.registerForm.value.email,
        telefono: this.registerForm.value.telefono
      }; 
  
      this.dataService.registerUser(newUser).subscribe({
        next: (response) => {
          alert('Registro exitoso');
          
          // Almacenar el token si lo devuelve la API
          if (response.token) {
            localStorage.setItem('token', response.token);
          }

          this.router.navigate(['home']); // Redirigir tras registro exitoso
        },
        error: (error) => {
          alert('Error al crear el usuario: ' + error.error.mensaje || 'Error desconocido');
        },
        complete: () => {
          console.log('Registro completado');
        }
      });
      
    } else {
      console.log('Formulario inválido', this.registerForm);
      this.registerForm.markAllAsTouched();
    }
  }
}
