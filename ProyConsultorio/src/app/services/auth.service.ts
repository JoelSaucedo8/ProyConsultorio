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

  private userName: string | null = null; // Almacena nombre de usuario logueado
  private role: string | null = null; // Almacena rol de usuario
  currentRoleSubject: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);
<<<<<<< HEAD
  getUserRole: any;
=======
  getUserId: any;
>>>>>>> 0520af96382c6aa0bdf6ed7fc66375b3fecc30ef

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
<<<<<<< HEAD
  login(body: any): Observable<any> {
    return this.http.post(this.apiUrl + '/login', body);
=======
  login(usuario: string, password: string): Observable<boolean> {
    console.log(`Intentando iniciar sesión con usuario: ${usuario} y contraseña: ${password}`);
    return this.http.post<{ codigo: number, mensaje: string, payload: any, jwt: string }>(`${this.apiUrl}/login`, { usuario, password }).pipe(
      map(response => {
        if (response.codigo === 200) {
          const token = response.jwt; // Token JWT de la respuesta
          localStorage.setItem('token', token); // Almacena el token en localStorage
          const user = response.payload[0]; // Asegúrate de que estás accediendo al primer elemento del payload
          this.userName = user.nombre; // Almacena nombre de usuario
          this.role = user.rol; // Almacena rol de usuario
          this.currentRoleSubject.next(this.role); // Rol actual
          this.isLoggedInSubject.next(true); // Actualiza el estado de inicio de sesión
          return true; // Login exitoso
        } else {
          return false; // Login fallido
        }
      }),
      catchError(err => {
        console.error('Error en el login:', err);
        return of(false); 
      })
    );
>>>>>>> 0520af96382c6aa0bdf6ed7fc66375b3fecc30ef
  }

  // Obtiene las cabeceras con el token
  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token'); 
    return new HttpHeaders({
      'Content-Type': 'application/json',
<<<<<<< HEAD
      'Authorization': `${token}` 
=======
      'Authorization': `Bearer ${token}`
>>>>>>> 0520af96382c6aa0bdf6ed7fc66375b3fecc30ef
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
  // Getter público para isLoggedInSubject
  get isLoggedIn(): boolean {
    return this.isLoggedInSubject.value;
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


// ver de agregar esto

// import { Injectable } from '@angular/core';
// import { HttpClient, HttpHeaders } from '@angular/common/http';
// import { Observable } from 'rxjs';

// @Injectable({
//   providedIn: 'root'
// })
// export class AuthService {
//   private apiUrl = 'http://localhost:4000/api/login'; // Asegúrate de que esta URL esté correcta

  // constructor(private http: HttpClient) { }
  // getUserRole(): string {
    // Supongamos que el rol se guarda en el localStorage
  //   return localStorage.getItem('userRole') || 'guest';
  // }
