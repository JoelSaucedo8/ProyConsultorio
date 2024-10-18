import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  username: string = 'user';
  password: string = '12345';

  constructor(
    public dialogRef: MatDialogRef<LoginComponent>,
    private authService: AuthService,
    private router: Router
  ) {}

  iniciar(): void {
    console.log('Intentando iniciar sesión...');
            this.router.navigate(['/home-usuario']); //se dirige al componente home-usuario
            this.close() 
        }

  close(): void {
    this.dialogRef.close(); 
  }
}
