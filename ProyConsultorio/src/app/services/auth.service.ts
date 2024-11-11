import { BehaviorSubject, catchError, map, Observable, of } from "rxjs";
import { User } from "../interfaces/user.interface";
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:4000/api';
  private isLoggedInSubject = new BehaviorSubject<boolean>(false);
  isLoggedIn$ = this.isLoggedInSubject.asObservable();

  private currentUser: User | null = null;
  private roleSubject: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);

  constructor(private http: HttpClient) {}

  // Registrar un nuevo usuario
  register(userData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/crearUsuario`, userData).pipe(
      map(response => {
        if (response && response.codigo === 200) {
          const user: User = response.payload[0];
          this.currentUser = user;
          this.roleSubject.next(user.rol); // Actualiza el rol
          this.isLoggedInSubject.next(true);
          localStorage.setItem('token', response.token); // Almacena el token
        }
        return response;
      }),
      catchError(err => {
        console.error('Error en el registro:', err);
        return of(null);
      })
    );
  }

  // Iniciar sesión
  login(body: any): Observable<any> {
    return this.http.post(this.apiUrl + '/login', body).pipe(
      map((response: any) => {
        if (response && response.codigo === 200) {
          const user: User = response.payload[0];
          console.log(user.rol); // Verifica que el rol esté presente
          this.currentUser = user;
          this.roleSubject.next(user.rol);
          this.isLoggedInSubject.next(true);
          localStorage.setItem('token', response.token); // Almacena el token
          localStorage.setItem('rol', response.payload.role);  // Asumiendo que el backend retorna el rol del usuario
        }
        return response;
      }),
      catchError(err => {
        console.error('Error en el inicio de sesión:', err);
        return of(null);
      })
    );
  }

  // Cerrar sesión
  logout(): void {
    this.isLoggedInSubject.next(false);
    this.currentUser = null;
    this.roleSubject.next(null);
    localStorage.removeItem('token');
  }

  // Obtener nombre de usuario
  getUserName(): string | null {
    return this.currentUser ? this.currentUser.nombre : null;
  }

  // Obtener el rol del usuario de manera reactiva
  getUserRole(): Observable<string | null> {
    return this.roleSubject.asObservable();
  }

  // Setter para establecer el rol (opcional si quieres actualizar el rol manualmente)
  setRole(role: string): void {
    this.roleSubject.next(role);
  }

  // Getter para el estado de inicio de sesión
  get isLoggedIn(): boolean {
    return this.isLoggedInSubject.value;
  }
}
