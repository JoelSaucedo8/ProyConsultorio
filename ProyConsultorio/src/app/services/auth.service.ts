import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private tokenKey = 'authToken';
  private apiUrl = 'http://localhost:4000/api/login';
  private loggedIn = new BehaviorSubject<boolean>(false);

  isLoggedIn$: Observable<boolean> = this.loggedIn.asObservable();

  constructor(private http: HttpClient) {
    const storedUserRole = localStorage.getItem('userRole');
    this.loggedIn.next(!!storedUserRole); // Cambiado a true/false
  }

  // Método para guardar el token y el rol
  setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
    const decodedToken: any = this.decodeToken(token);
    const userRole = decodedToken.role;
    localStorage.setItem('userRole', userRole); // Guardar el rol del usuario
    this.loggedIn.next(true); // Cambia el estado de loggedIn a true
  }

  // Método para decodificar el token
  private decodeToken(token: string): any {
    return JSON.parse(atob(token.split('.')[1]));
  }

  // Obtener el rol desde el token almacenado
  getRole(): string | null {
    return localStorage.getItem('userRole');
  }

  isAdmin(): boolean {
    return this.getRole() === 'admin'; // Comprobar si el rol es admin
  }

  getUserRole(): string {
    const role = this.getRole();
    return role ? role : 'paciente'; // Retorna el rol o 'paciente' si no está disponible
  }

  login(usuario: string, password: string): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const body = JSON.stringify({ usuario, password });
    return this.http.post(this.apiUrl, body, { headers }).pipe(
      tap((response: any) => {
        if (response && response.token) {
          this.setToken(response.token); // Llama a setToken con el token recibido
        }
      })
    );
  }

  logout(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userRole');
    this.loggedIn.next(false);
  }
}
