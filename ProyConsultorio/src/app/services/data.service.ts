import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private apiUrl = 'http://localhost:4000/api'; // URL base del backend

  constructor(private http: HttpClient) { }

  // Obtener datos del backend
  getData(): Observable<any> {
    return this.http.get(`${this.apiUrl}/obtenerUsuarios`); // Ejemplo de endpoint para obtener usuarios
  }

  // Registrar un nuevo usuario
  registerUser(newUser: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('token') // Para incluir el token si es necesario
    });
    return this.http.post<any>(`${this.apiUrl}/crearUsuario`, newUser, { headers });
  }

  // Obtener un usuario por ID
  getUsuario(id: string): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + localStorage.getItem('token') // Incluir token si es necesario
    });
    return this.http.get<any>(`${this.apiUrl}/obtenerUsuarios/${id}`, { headers });
  }

  // Actualizar un usuario
  updateUsuario(id: string, updatedUser: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('token') // Incluir token si es necesario
    });
    return this.http.put<any>(`${this.apiUrl}/obtenerUsuarios/${id}`, updatedUser, { headers });
  }

  // Borrar un usuario
  deleteUsuario(id: string): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + localStorage.getItem('token') // Incluir token si es necesario
    });
    return this.http.delete<any>(`${this.apiUrl}/obtenerUsuarios/${id}`, { headers });
  }
}

