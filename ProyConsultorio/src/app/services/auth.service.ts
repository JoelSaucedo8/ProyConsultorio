import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, catchError, map, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:4000/api'; // URL base del backend
  private isLoggedInSubject = new BehaviorSubject<boolean>(false);
  isLoggedIn$ = this.isLoggedInSubject.asObservable();

  private userName: string | null = null; // almacena nombre de usuario logueado
  private role: string | null = null; // almacena rol de usuario
  currentRoleSubject: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);

  constructor(private http: HttpClient) {}

  // Método para registrar un nuevo usuario
  register(userData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/register`, userData).pipe(
      map(response => {
        // Puedes manejar la respuesta según lo que devuelva tu backend
        return response; 
      }),
      catchError(err => {
        console.error('Error en el registro:', err);
        return of(null); // Devuelve null en caso de error
      })
    );
  }

  // iniciar sesion
  login(usuario: string, password: string): Observable<boolean> {
    console.log(`Intentando iniciar sesión con usuario: ${usuario} y contraseña: ${password}`);
    return this.http.post<{ codigo: number, mensaje: string, payload: any, jwt: string }>(this.apiUrl + '/login', { usuario, password }).pipe(
      map(response => {
        if (response.codigo === 200) {
          const token = response.jwt; // token jwt de la respuesta
          localStorage.setItem('token', token); // almacena el token en localStorage
          const user = response.payload[0]; // Asegúrate de que estás accediendo al primer elemento del payload
          this.userName = user.nombre; // almacena nombre de usuario
          this.role = user.rol; // almacena rol del usuario
          this.currentRoleSubject.next(this.role); // rol actual
          this.isLoggedInSubject.next(true); // actualizar estado de inicio de sesión
          return true; // login exitoso
        } else {
          return false; // login fallido
        }
      }),
      catchError(err => {
        console.error('Error en el login:', err);
        return of(false); 
      })
    );
  }

  // obtiene las cabeceras con el token
  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token'); 
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}` 
    });
  }

  //cerrar sesion
  logout(): void {
    this.isLoggedInSubject.next(false);
    this.userName = null; // eliminar nombre de usuario
    this.role = null; // eliminar rol al iniciar sesión
    this.currentRoleSubject.next(null); // eliminar rol actual
    localStorage.removeItem('token'); // eliminar token de localStorage
  }

  getUserName(): string | null {
    return this.userName; // usuario logueado
  }

  getRole(): string | null {
    return this.role; // rol del usuario al loguearse
  }
}
