import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

const API_URL = 'http://localhost:4000/api';

@Injectable({
  providedIn: 'root'
})
export class AgendaService {

  private headers = new HttpHeaders({
    'Authorization': localStorage.getItem('token') || '',
    'Content-Type': 'application/json'
  });

  constructor(private http: HttpClient) {}

  // manejo de errores
  private manejarError(error: any): Observable<never> {
    console.error("Ocurrió un error:", error);
    return throwError(() => new Error(error.message || 'Error en la solicitud'));
  }

  // agenda del medico
  obtenerAgenda(idMedico: number): Observable<any> {
    return this.http.get(`${API_URL}/obtenerAgenda/${idMedico}`, { headers: this.headers })
      .pipe(catchError(this.manejarError));
  }

  // nueva agenda
  crearAgenda(idMedico: number, idEspecialidad: number, fecha: string, horaEntrada: string, horaSalida: string): Observable<any> {
    const body = {
      id_medico: idMedico,
      id_especialidad: idEspecialidad,
      fecha,
      hora_entrada: horaEntrada,
      hora_salida: horaSalida
    };
    return this.http.post(`${API_URL}/crearAgenda`, body, { headers: this.headers })
      .pipe(catchError(this.manejarError));
  }

  // modif agenda existente
  modificarAgenda(id: number, idMedico: number, idEspecialidad: number, fecha: string, horaEntrada: string, horaSalida: string): Observable<any> {
    const body = {
      id_medico: idMedico,
      id_especialidad: idEspecialidad,
      fecha,
      hora_entrada: horaEntrada,
      hora_salida: horaSalida
    };
    return this.http.put(`${API_URL}/modificarAgenda/${id}`, body, { headers: this.headers })
      .pipe(catchError(this.manejarError));
  }
}
