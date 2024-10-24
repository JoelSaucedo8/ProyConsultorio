import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:4000/api/login'; // Asegúrate de que esta URL esté correcta

  constructor(private http: HttpClient) { }
  getUserRole(): string {
    // Supongamos que el rol se guarda en el localStorage
    return localStorage.getItem('userRole') || 'guest';
  }

  login(usuario: string, password: string): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const body = JSON.stringify({ usuario, password });

    return this.http.post(this.apiUrl, body, { headers });
  }

  loginRole(role: string): void {
    localStorage.setItem('userRole', role);
  }

  logout(): void {
    localStorage.removeItem('userRole');
  }

  
}
