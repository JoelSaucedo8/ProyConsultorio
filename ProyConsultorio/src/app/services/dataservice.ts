// data.service.ts

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private apiUrl = 'http://localhost:4000/api'; // URL base del backend

  constructor(private http: HttpClient) { }

  // Manejo de errores
  private handleError(error: any) {
    console.error('Ocurrió un error:', error);
    return throwError(() => new Error('Error en la petición. Por favor intenta de nuevo.'));
  }

  // Obtener todos los usuarios
  getData(): Observable<any> {
    return this.http.get(`${this.apiUrl}/obtenerUsuarios`)
      .pipe(catchError(this.handleError));
  }

  // Obtener un turno por ID
  obtenerTurnoPaciente(id: string): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + localStorage.getItem('token') || ''
    });
    return this.http.get<any>(`${this.apiUrl}/obtenerTurnoPaciente/${id}`, { headers })
      .pipe(catchError(this.handleError));
  }

  // Asignar un nuevo turno
  asignarTurnoPaciente(turno: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + (localStorage.getItem('token') || '')
    });
    return this.http.post<any>(`${this.apiUrl}/asignarTurnoPaciente`, turno, { headers })
      .pipe(catchError(this.handleError));
  }

  // Registrar nuevo usuario
  registerUser(newUser: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + (localStorage.getItem('token') || '')
    });
    return this.http.post<any>(`${this.apiUrl}/crearUsuario`, newUser, { headers })
      .pipe(catchError(this.handleError));
  }

  // Obtener turnos del usuario
  getTurnos(usuarioId: string): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + localStorage.getItem('token') || ''
    });
    return this.http.get<any>(`${this.apiUrl}/obtenerTurnos/${usuarioId}`, { headers })
      .pipe(catchError(this.handleError));
  }

  // Crear un nuevo turno
  crearTurno(turno: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + (localStorage.getItem('token') || '')
    });
    return this.http.post<any>(`${this.apiUrl}/crearTurno`, turno, { headers })
      .pipe(catchError(this.handleError));
  }

  // Eliminar un turno
  borrarTurno(turnoId: string): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + localStorage.getItem('token') || ''
    });
    return this.http.delete<any>(`${this.apiUrl}/borrarTurno/${turnoId}`, { headers })
      .pipe(catchError(this.handleError));
  }
}
