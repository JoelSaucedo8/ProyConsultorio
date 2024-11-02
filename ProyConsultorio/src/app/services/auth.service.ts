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
    this.loggedIn.next(this.isAuthenticated());
  }

  getUsuarioId(): number | null {
    const userId = localStorage.getItem('userId');
    return userId ? +userId : null;
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
    const decodedToken = this.decodeToken(token);
    const userId = decodedToken?.sub;
    const userRole = decodedToken?.role;
    if (userId) localStorage.setItem('userId', userId);
    if (userRole) localStorage.setItem('userRole', userRole);
    this.loggedIn.next(true);
  }

  private decodeToken(token: string): any {
    try {
      return JSON.parse(atob(token.split('.')[1]));
    } catch (e) {
      console.error("Error al decodificar el token:", e);
      return null;
    }
  }

  getRole(): string | null {
    return this.isAuthenticated() ? localStorage.getItem('userRole') : null;
  }

  isAdmin(): boolean {
    return this.getRole() === 'admin';
  }

  login(usuario: string, password: string): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const body = JSON.stringify({ usuario, password });
    return this.http.post(this.apiUrl, body, { headers }).pipe(
      tap((response: any) => {
        if (response && response.jwt) {
          this.setToken(response.jwt);
        }
      }),
      catchError(error => {
        console.error('Error en la autenticación:', error);
        return throwError(() => error);
      })
    );
  }

  isAuthenticated(): boolean {
    const token = localStorage.getItem(this.tokenKey);
    if (token) {
      const decodedToken = this.decodeToken(token);
      if (decodedToken?.exp > Date.now() / 1000) {
        return true;
      } else {
        this.logout();
      }
    }
    return false;
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem('userRole');
    localStorage.removeItem('userId');
    this.loggedIn.next(false);
  }
}
