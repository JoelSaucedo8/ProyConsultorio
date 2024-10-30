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
  documento: string = ''; 
  password: string = ''; 
  
  constructor(
    public dialogRef: MatDialogRef<LoginComponent>,
    private authService: AuthService,
    private router: Router
  ) {}

  iniciar(){
    const user = {
      usuario: this.documento,
      password: this.password
    }
      console.log(user)
    this.authService.login(user).subscribe((data:any)=>{
      console.log(data)
      this.dialogRef.close()
      localStorage.setItem('token', data.jwt)
      this.router.navigate(['/home-usuario']);
    })
  }

  cerrar(): void {
    this.dialogRef.close(); 
  }
}
