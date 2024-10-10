import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  getUserRole(): string {
    // Supongamos que el rol se guarda en el localStorage
    return localStorage.getItem('userRole') || 'guest';
  }

  login(role: string): void {
    localStorage.setItem('userRole', role);
  }

  logout(): void {
    localStorage.removeItem('userRole');
  }

  constructor() { }
}
