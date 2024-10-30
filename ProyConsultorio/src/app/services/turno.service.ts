import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Turno } from '../interfaces/home-usuario.interface';

@Injectable({
  providedIn: 'root',
})
export class TurnoService {
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
  }
}
