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
      .pipe(catchError(this.handleError)); // agrega manejo de errores
  }

  // Registrar nuevo usuario
  registerUser(newUser: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('token') || ''
    });
    return this.http.post<any>(`${this.apiUrl}/crearUsuario`, newUser, { headers })
      .pipe(catchError(this.handleError)); 
  }

  // Obtener usuario por ID
  getUsuario(id: string): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + localStorage.getItem('token') || ''
    });
    return this.http.get<any>(`${this.apiUrl}/obtenerUsuarios/${id}`, { headers })
      .pipe(catchError(this.handleError)); 
  }

  // Actualizar un usuario
  updateUsuario(id: string, updatedUser: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('token') || ''
    });
    return this.http.put<any>(`${this.apiUrl}/obtenerUsuarios/${id}`, updatedUser, { headers })
      .pipe(catchError(this.handleError)); 
  }

  // Eliminar un usuario
  deleteUsuario(id: string): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + localStorage.getItem('token') || ''
    });
    return this.http.delete<any>(`${this.apiUrl}/obtenerUsuarios/${id}`, { headers })
      .pipe(catchError(this.handleError)); 
  }
}
