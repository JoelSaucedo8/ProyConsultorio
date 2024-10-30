import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, catchError, map, Observable, of } from 'rxjs';
import { Turno } from '../interfaces/home-usuario.interface';

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
  getUserRole: any;

  constructor(private http: HttpClient) {}

  // Método para registrar un nuevo usuario
  register(userData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/crearUsuario`, userData).pipe(
      map(response => {
        // Verifica si la respuesta es exitosa
        if (response && response.codigo === 200) {
          const user = response.payload[0]; // Accede a la información del usuario
          this.userName = user.nombre; // Almacena el nombre de usuario
          this.role = user.rol; // Almacena el rol del usuario
          this.currentRoleSubject.next(this.role); // Actualiza el rol actual
          this.isLoggedInSubject.next(true); // Actualiza el estado de inicio de sesión
        }
        return response; // Devuelve la respuesta
      }),
      catchError(err => {
        console.error('Error en el registro:', err);
        return of(null); // Maneja errores
      })
    );
  }

  // Iniciar sesión
  login(body: any): Observable<any> {
    return this.http.post(this.apiUrl + '/login', body);
  }

  // Obtiene las cabeceras con el token
  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token'); 
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `${token}` 
    });
  }

  // Cerrar sesión
  logout(): void {
    this.isLoggedInSubject.next(false);
    this.userName = null; // Elimina nombre de usuario
    this.role = null; // Elimina rol al iniciar sesión
    this.currentRoleSubject.next(null); // Elimina rol actual
    localStorage.removeItem('token'); // Elimina token de localStorage
  }

  getUserName(): string | null {
    return this.userName; // Usuario logueado
  }

  getRole(): string | null {
    return this.role; // Rol del usuario al loguearse
  }

  // Obtener turnos del paciente
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

  // Agregar un nuevo turno y guardarlo en localStorage
  addTurno(turno: Turno): Observable<Turno | null> {
    return this.http.post<Turno>(`${this.apiUrl}/asignarTurnoPaciente`, turno).pipe(
      map(nuevoTurno => {
        const userId = turno.id_paciente; // Ajusta según cómo se maneje el ID del usuario
        const turnos = JSON.parse(localStorage.getItem(`turnos_${userId}`) || '[]');
        turnos.push(nuevoTurno);
        localStorage.setItem(`turnos_${userId}`, JSON.stringify(turnos));
        return nuevoTurno;
      }),
      catchError((error) => {
        console.error('Error al asignar turno:', error);
        return of(null); // Devuelve null en caso de error
      })
    );
  }

  // Borrar un turno de localStorage y del backend
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
