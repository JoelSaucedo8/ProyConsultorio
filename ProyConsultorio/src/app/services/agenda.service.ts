import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

const API_URL = 'http://localhost:4000/api'; 

@Injectable({
  providedIn: 'root'
})
export class AgendaService {

  constructor(private http: HttpClient) {}

  // config de token de autorizacion
  private obtenerConfigToken() {
    const token = localStorage.getItem('token');
    return {
      headers: new HttpHeaders({
        'Authorization': token || '',
        'Content-Type': 'application/json'
      })
    };
  }

  // obtener agenda de un medico
  obtenerAgenda(idMedico: number): Observable<any> {
    return this.http.get(`${API_URL}/obtenerAgenda/:id_medico/${idMedico}`, this.obtenerConfigToken())
      .pipe(
        catchError(error => {
          console.error("Error obteniendo agenda:", error);
          return throwError(error);
        })
      );
  }

  // private obtenerConfigToken() {
  //   const token = localStorage.getItem('token');
  //   return {
  //     headers: new HttpHeaders({
  //       'Authorization': token || '',
  //       'Content-Type': 'application/json'
  //     })
  //   };
  // }

  // crear una nueva agenda 
  crearAgenda(idMedico: number, idEspecialidad: number, fecha: string, horaEntrada: string, horaSalida: string): Observable<any> {
    const body = {
      id_medico: idMedico,
      id_especialidad: idEspecialidad,
      fecha: fecha,
      hora_entrada: horaEntrada,
      hora_salida: horaSalida
    };
    return this.http.post(`${API_URL}/crearAgenda`, body, this.obtenerConfigToken())
      .pipe(
        catchError(error => {
          console.error("Error creando agenda:", error);
          return throwError(error);
        })
      );
  }

  // modificar agenda existente
  modificarAgenda(id: number, idMedico: number, idEspecialidad: number, fecha: string, horaEntrada: string, horaSalida: string): Observable<any> {
    const body = {
      id_medico: idMedico,
      id_especialidad: idEspecialidad,
      fecha: fecha,
      hora_entrada: horaEntrada,
      hora_salida: horaSalida
    };
    return this.http.put(`${API_URL}/modificarAgenda/:id/${id}`, body, this.obtenerConfigToken())
      .pipe(
        catchError(error => {
          console.error("Error modificando agenda:", error);
          return throwError(error);
        })
      );
  }
}
