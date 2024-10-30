import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

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
  obtenerCoberturas(){  

    return this.http.get(`${API_URL}/obtenerCoberturas`, {
      headers: {
        'Authorization': '' + localStorage.getItem('token')
      }
    });
    
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
