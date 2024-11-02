import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { LoginComponent } from '../login/login.component';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  userRole: string | null;

  constructor(public dialog: MatDialog, private authService: AuthService, private router: Router) {
    this.userRole = this.authService.getRole();
  }
  

  openPopup(): void {
    this.dialog.open(LoginComponent);
  }

  goToRegister(): void {
    this.router.navigate(['/register']);
  }

}
