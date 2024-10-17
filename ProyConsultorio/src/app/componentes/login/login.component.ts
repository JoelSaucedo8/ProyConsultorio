import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  dni: string = '';
  password: string = '';

  constructor(
    public dialogRef: MatDialogRef<LoginComponent>, 
    private router: Router
  ) {}

  async login(): Promise<void> { 
    try {
        console.log("Datos de login:", { dni: this.dni, password: this.password });
        
        const response = await fetch('http://localhost:4000/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ dni: this.dni, password: this.password })
            
        });
console.log(response)
        const data = await response.json();

        if (response.ok) {
            alert('Inicio de sesión exitoso');
            console.log("Datos del usuario:", data.payload);
            this.router.navigate(['/home-usuario']);
            this.close();
        } else {
            const errorMessage = data.mensaje || 'Error desconocido';
            alert('Error: ' + errorMessage);
        }
    } catch (error) {
        console.error('Error en la solicitud de inicio de sesión:', error);
    }
}


  close(): void {
    this.dialogRef.close();
  }
}
