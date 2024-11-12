import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { User } from '../interfaces/user.interface';

const API_URL = 'http://localhost:4000/api';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  constructor(private http: HttpClient) {}

  // Obtener todos los usuarios
  obtenerUsuarios(): Observable<User[]> {
    return this.http.get<User[]>(`${API_URL}/obtenerUsuarios`).pipe(
      catchError(this.handleError)
    );
  }

  // Obtener un usuario por ID
  obtenerUsuario(id: number): Observable<User> {
    return this.http.get<User>(`${API_URL}/obtenerUsuario/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  // Crear un nuevo usuario
  crearUsuario(usuario: User): Observable<User> {
    return this.http.post<User>(`${API_URL}/crearUsuario`, usuario).pipe(
      catchError(this.handleError)
    );
  }

  // Actualizar un usuario
  actualizarUsuario(id: number, usuario: User): Observable<User> {
    return this.http.put<User>(`${API_URL}/actualizarUsuario/${id}`, usuario).pipe(
      catchError(this.handleError)
    );
  }

  // Eliminar un usuario
eliminarUsuario(id: number): Observable<void> {
  return this.http.delete<void>(`${API_URL}/eliminarUsuario/${id}`).pipe(
    catchError(this.handleError)
  );
}

  // Manejo de errores
  private handleError(error: any): Observable<never> {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // Error del lado del cliente
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Error del lado del servidor
      errorMessage = `Código de error: ${error.status}\nMensaje: ${error.message}`;
    }
    return throwError(errorMessage);
  }
}
