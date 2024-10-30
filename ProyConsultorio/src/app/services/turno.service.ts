import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Turno } from '../interfaces/home-usuario.interface';

@Injectable({
  providedIn: 'root',
})
export class TurnoService {
<<<<<<< HEAD
  private apiUrl = 'http://localhost:4000/api'; 

  constructor(private http: HttpClient) {}

  // obtener turnos de un paciente por ID
  getTurnos(userId: string): Observable<Turno[]> {
    return this.http.get<Turno[]>(`${this.apiUrl}/obtenerTurnoPaciente/${userId}`);
  }

  // agregar nuevo turno
  addTurno(turno: Turno): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/asignarTurnoPaciente`, turno);
  }

  //borrar un turno por ID
  deleteTurno(turnoId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/eliminarTurnoPaciente/${turnoId}`);
=======
  private apiUrlObtener = 'http://localhost:4000/api/obtenerTurnoPaciente'; // Endpoint para obtener turnos
  private apiUrlAsignar = 'http://localhost:4000/api/asignarTurnoPaciente'; // Endpoint para asignar/agregar turnos

  constructor(private http: HttpClient) {}

  // Obtener los turnos para un usuario específico
  getTurnos(userId: string): Observable<{ turnos: Turno[] }> {
    return this.http.get<{ turnos: Turno[] }>(`${this.apiUrlObtener}/${userId}`); 
  }

  // Agregar un nuevo turno
  addTurno(turno: any) {
    return this.http.post<Turno>(this.apiUrlAsignar, turno);
  }

  // Borrar un turno por su ID
  deleteTurno(turnoId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrlObtener}/${turnoId}`);
>>>>>>> 0520af96382c6aa0bdf6ed7fc66375b3fecc30ef
  }
}