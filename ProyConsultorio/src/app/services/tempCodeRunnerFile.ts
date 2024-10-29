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

  // Obtener los turnos de un usuario específico
  getTurnos(userId: string): Observable<Turno[]> {
    return this.http.get<Turno[]>(`${this.apiUrl}/obtenerTurnoPaciente/${userId}`);
  }

  // Asignar o agregar un nuevo turno
  addTurno(turno: Turno): Observable<Turno> {
    return this.http.post<Turno>(`${this.apiUrl}/asignarTurnoPaciente`, turno);
  }

  // Borrar un turno
  deleteTurno(turnoId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/eliminarTurno/${turnoId}`);
  }

  // Almacenar un turno (equivalente a agregar en este contexto)
  storeTurno(turno: Turno): Observable<Turno> {
    return this.addTurno(turno);
  }
}
