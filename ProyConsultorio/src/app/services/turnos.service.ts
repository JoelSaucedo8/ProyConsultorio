// src/app/services/turno.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Turno } from '../interfaces/turno.interface';
import { Profesional } from '../interfaces/profesional.interface'; // Asegúrate de que la ruta sea correcta


@Injectable({
  providedIn: 'root'
})
export class TurnoService {
  private apiUrl = 'http://tu-api-url.com/api/turnos'; // Cambia esto a la URL de tu API

  constructor(private http: HttpClient) {}

  // Obtener turnos de un paciente por ID
  obtenerTurnoPaciente(pacienteId: number): Observable<Turno[]> {
    return this.http.get<Turno[]>(`${this.apiUrl}/obtenerTurnoPaciente/${pacienteId}`);
  }

  // Obtener turnos de un médico (asumido que el médico tiene algún ID)
  obtenerTurnosMedico(medicoId: number): Observable<Turno[]> {
    return this.http.post<Turno[]>(`${this.apiUrl}/obtenerTurnosMedico`, { medicoId });
  }

  // Asignar un turno a un paciente
  asignarTurnoPaciente(turno: Turno): Observable<Turno> {
    return this.http.post<Turno>(`${this.apiUrl}/asignarTurnoPaciente`, turno);
  }

  // Actualizar un turno existente
  actualizarTurnoPaciente(turno: Turno): Observable<Turno> {
    return this.http.put<Turno>(`${this.apiUrl}/actualizarTurnoPaciente/${turno.id}`, turno);
  }

  // Eliminar un turno por ID
  eliminarTurnoPaciente(turnoId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/eliminarTurnoPaciente/${turnoId}`);
  }

  obtenerCoberturas(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/coberturas`);
  }
  
  obtenerEspecialidadesPorCobertura(cobertura: string): Observable<string[]> {
    return this.http.post<string[]>(`${this.apiUrl}/especialidades`, { cobertura });
  }
  
  obtenerProfesionalesPorEspecialidad(especialidad: string): Observable<Profesional[]> {
    return this.http.get<Profesional[]>(`/api/profesionales?especialidad=${especialidad}`);
  }
  
  obtenerHorasDisponibles(fecha: Date): Observable<string[]> {
    return this.http.post<string[]>(`${this.apiUrl}/horasDisponibles`, { fecha });
  }
}
