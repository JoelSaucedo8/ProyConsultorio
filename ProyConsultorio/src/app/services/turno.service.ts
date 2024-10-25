import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Turno } from '../interfaces/home-usuario.interface';

@Injectable({
  providedIn: 'root',
})
export class TurnoService {
  private apiUrlObtener = 'http://localhost:4000/api/obtenerTurnoPaciente'; //obtener turnos
  private apiUrlAsignar = 'http://localhost:4000/api/asignarTurnoPaciente'; //asignar/agregar turnos
  agregarTurno: any;

  constructor(private http: HttpClient) {}

  // Obtener los turnos
  getTurnos(userId: string): Observable<Turno[]> {
    return this.http.get<Turno[]>(`${this.apiUrlObtener}/${userId}`); // iddel usuario
  }

  // Agregar un nuevo turno
  addTurno(turno: Turno): Observable<Turno> {
    return this.http.post<Turno>(this.apiUrlAsignar, turno); // Usa la ruta correcta para almacenar
  }

  // Borrar un turno
  deleteTurno(turnoId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrlObtener}/${turnoId}`); // Asegúrate de usar la ruta correcta para eliminar
  }

  // Almacenar los turnos
  storeTurno(turno: Turno): Observable<Turno> {
    return this.addTurno(turno);
  }
}
