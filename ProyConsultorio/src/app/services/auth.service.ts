import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, catchError, map, Observable, of } from 'rxjs';
import { Turno } from '../interfaces/home-usuario.interface';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:4000/api';
  private isLoggedInSubject = new BehaviorSubject<boolean>(false);
  isLoggedIn$ = this.isLoggedInSubject.asObservable();

  private userName: string | null = null; // almacena nombre de usuario logueado
  private role: string | null = null; // almacena rol de usuario
  currentRoleSubject: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);
  getUserRole: any;

  constructor(private http: HttpClient) {}

  // registra un nuevo usuario
  register(userData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/crearUsuario`, userData).pipe(
      map(response => {
        // verifica si la respuesta es exitosa
        if (response && response.codigo === 200) {
          const user = response.payload[0]; // accede a la info del usuario
          this.userName = user.nombre; // almacena nombre de usuario
          this.role = user.rol; // almacena rol del usuario
          this.currentRoleSubject.next(this.role); // actualiza  rol actual
          this.isLoggedInSubject.next(true); // actualiza estado de inicio de sesión
        }
        return response; 
      }),
      catchError(err => {
        console.error('Error en el registro:', err);
        return of(null); // maneja errores
      })
    );
  }

  // inicio sesion
  login(body: any): Observable<any> {
    return this.http.post(this.apiUrl + '/login', body);
  }

  // obtiene las cabeceras con el token
  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token'); 
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `${token}` 
    });
  }

  // cerrar sesion
  logout(): void {
    this.isLoggedInSubject.next(false);
    this.userName = null; // elimina nombre de usuario
    this.role = null; // elimina rol al iniciar sesion
    this.currentRoleSubject.next(null); // elimina rol actual
    localStorage.removeItem('token'); // elimina token de localStorage
  }

  getUserName(): string | null {
    return this.userName; // usuario logueado
  }

  getRole(): string | null {
    return this.role; // rol del usuario logueado
  }
  // getter publico para isLoggedInSubject
  get isLoggedIn(): boolean {
    return this.isLoggedInSubject.value;
  }

  // obtiene turnos del paciente
  getTurnos(userId: string): Observable<Turno[]> {
    const turnosGuardados = localStorage.getItem(`turnos_${userId}`);
    if (turnosGuardados) {
      return of(JSON.parse(turnosGuardados) as Turno[]);
    } else {
      return this.http.get<Turno[]>(`${this.apiUrl}/obtenerTurnoPaciente/${userId}`).pipe(
        map(turnos => {
          localStorage.setItem(`turnos_${userId}`, JSON.stringify(turnos));
          return turnos;
        }),
        catchError((error) => {
          console.error('Error al obtener turnos:', error);
          return of([]);
        })
      );
    }
  }

  // agrega nuevo turno y lo guarda en localStorage
  addTurno(turno: Turno): Observable<Turno | null> {
    return this.http.post<Turno>(`${this.apiUrl}/asignarTurnoPaciente`, turno).pipe(
      map(nuevoTurno => {
        const userId = turno.id_paciente; 
        const turnos = JSON.parse(localStorage.getItem(`turnos_${userId}`) || '[]');
        turnos.push(nuevoTurno);
        localStorage.setItem(`turnos_${userId}`, JSON.stringify(turnos));
        return nuevoTurno;
      }),
      catchError((error) => {
        console.error('Error al asignar turno:', error);
        return of(null); // devuelve null en caso de error
      })
    );
  }

  // borra turno de localStorage y del backend
  deleteTurno(turnoId: string, userId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/eliminarTurnoPaciente/${turnoId}`).pipe(
      map(() => {
        const turnos = JSON.parse(localStorage.getItem(`turnos_${userId}`) || '[]');
        const turnosActualizados = turnos.filter((turno: Turno) => turno.id !== turnoId);
        localStorage.setItem(`turnos_${userId}`, JSON.stringify(turnosActualizados));
      }),
      catchError((error) => {
        console.error('Error al eliminar turno:', error);
        return of();
      })
    );
  }

}



