import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Turno } from 'src/app/Interfaces/turno.interface';

@Injectable({
  providedIn: 'root'
})
export class TurnoService {
  private apiUrlObtener = 'http://localhost:4000/api/obtenerTurnoPaciente';
  private apiUrlCrear = 'http://localhost:4000/api/asignarTurnoPaciente';

  constructor(private http: HttpClient) {}

  // Obtener todos los turnos
  obtenerTurnos(userId: number) {
    return this.http.get<Turno[]>(`/api/turnos/${userId}`);
  }
  

  // Obtener coberturas
  obtenerCoberturas(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrlObtener}/coberturas`);
  }

  // Obtener especialidades según la cobertura
  obtenerEspecialidades(cobertura: string): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrlObtener}/especialidades/${cobertura}`);
  }

  // Obtener profesionales según la especialidad
  obtenerProfesionales(especialidad: string): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrlObtener}/profesionales/${especialidad}`);
  }

  // Obtener horas disponibles según fecha y profesional
  obtenerHorasDisponibles(fecha: Date, profesional: string): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrlObtener}/horas-disponibles`, {
      params: {
        fecha: fecha.toISOString(), // Convertir a ISO string
        profesional: profesional
      }
    });
  }

  // Crear un nuevo turno
  // En turnos.service.ts
crearTurno(userId: number, turno: Turno): Observable<Turno> {
  const url = `${this.apiUrlCrear}/turnos/${userId}`; // Ejemplo de URL que incluye userId
  return this.http.post<Turno>(url, turno);
}


  // Borrar un turno por ID
  borrarTurno(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrlCrear}/turnos/${id}`);
  }
}
