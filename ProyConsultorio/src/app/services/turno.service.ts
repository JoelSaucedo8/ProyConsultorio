import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Turno } from '../interfaces/home-usuario.interface';

@Injectable({
  providedIn: 'root',
})
export class TurnoService {
  private apiUrl = 'http://localhost:4000/api/turnos'; 

  constructor(private http: HttpClient) {}

  // obtener los turnos
  getTurnos(): Observable<Turno[]> {
    return this.http.get<Turno[]>(this.apiUrl);
  }

  // agregar un nuevo turno
  addTurno(turno: Turno): Observable<Turno> {
    return this.http.post<Turno>(this.apiUrl, turno);
  }

  // borrar un turno
  deleteTurno(turnoId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${turnoId}`);
  }
}
