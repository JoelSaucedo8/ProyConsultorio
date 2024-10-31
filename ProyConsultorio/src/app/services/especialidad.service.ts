import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, Observable } from 'rxjs';

const API_URL = 'http://localhost:4000/api'; 

@Injectable({
  providedIn: 'root'
})
export class EspecialidadService {
  
  constructor(private http: HttpClient) {}

  // Config de token de autorización
  private obtenerConfigToken() {
    const token = localStorage.getItem('token');
    return {
      headers: new HttpHeaders({
        'Authorization': token || '',
        'Content-Type': 'application/json'
      })
    };
  }

  // Obtener especialidades
  obtenerEspecialidades(): Observable<any[]> {
    return this.http.get<any[]>(`${API_URL}/obtenerEspecialidades`, this.obtenerConfigToken());
  }

  // Obtener coberturas
  obtenerCoberturas(): Observable<any[]> {
    return this.http.get<any>(`${API_URL}/obtenerCoberturas`, this.obtenerConfigToken()).pipe(
      map(response => {
        if (response.codigo === 200) {
          console.log('Respuesta de obtenerCoberturas:', response);
          return response.payload; 
        } else {
          throw new Error('Error al obtener coberturas: ' + response.mensaje);
        }
      })
    );
  }

  // Obtener especialidades de médico
  obtenerEspecialidadesMedico(idMedico: number): Observable<any[]> {
    return this.http.get<any[]>(`${API_URL}/obtenerEspecialidadesMedico/${idMedico}`, this.obtenerConfigToken());
  }

  // Crear una relación entre médico y especialidad
  crearMedicoEspecialidad(idMedico: number, idEspecialidad: number): Observable<any> {
    const body = { id_medico: idMedico, id_especialidad: idEspecialidad };
    return this.http.post<any>(`${API_URL}/crearMedicoEspecialidad`, body, this.obtenerConfigToken());
  }
}
