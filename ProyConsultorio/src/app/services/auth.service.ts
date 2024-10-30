import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject, tap, catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private tokenKey = 'authToken';
  private apiUrl = 'http://localhost:4000/api/login';
  private loggedIn = new BehaviorSubject<boolean>(false);

  isLoggedIn$: Observable<boolean> = this.loggedIn.asObservable();

  constructor(private http: HttpClient) {
    const storedToken = localStorage.getItem(this.tokenKey);
    this.loggedIn.next(this.isAuthenticated()); // Estado según autenticación
  }

  getUserId(): number | null {
    const userId = localStorage.getItem('userId');
    return userId ? +userId : null;
  }

  // Método para guardar el token y el rol
  setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
    const decodedToken = this.decodeToken(token);
    console.log("Token decodificado:", decodedToken);

    const userId = decodedToken?.sub;
    const userRole = decodedToken?.role;
    if (userId) localStorage.setItem('userId', userId);
    if (userRole) localStorage.setItem('userRole', userRole);

    this.loggedIn.next(true);
  }

  // Método para decodificar el token
  private decodeToken(token: string): any {
    try {
      return JSON.parse(atob(token.split('.')[1]));
    } catch (e) {
      console.error("Error al decodificar el token:", e);
      return null;
    }
  }

  // Obtener el rol desde el token almacenado
  getRole(): string | null {
    return this.isAuthenticated() ? localStorage.getItem('userRole') : null;
  }

  // Comprobar si el rol es admin
  isAdmin(): boolean {
    return this.getRole() === 'admin';
  }

  // Obtener el rol o retornar "paciente" como valor predeterminado
  getUserRole(): string {
    return this.getRole() || 'paciente';
  }

  // Método de inicio de sesión
  login(usuario: string, password: string): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const body = JSON.stringify({ usuario, password });
    return this.http.post(this.apiUrl, body, { headers }).pipe(
      tap((response: any) => {
        if (response && response.jwt) { // Cambié "token" a "jwt" según tu back
          this.setToken(response.jwt);
        }
      }),
      catchError(error => {
        console.error('Error en la autenticación:', error);
        return throwError(() => error);
      })
    );
  }

  // Verificación de autenticación
  isAuthenticated(): boolean {
    const token = localStorage.getItem(this.tokenKey);
    if (token) {
      const decodedToken = this.decodeToken(token);
      if (decodedToken?.exp > Date.now() / 1000) {
        return true;
      } else {
        this.logout(); // Eliminar el token si expiró
      }
    }
    return false;
  }

  // Cierre de sesión
  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem('userRole');
    localStorage.removeItem('userId');
    this.loggedIn.next(false);
  }
}
