// src/app/models/turno.model.ts
export interface Turno {
  id?: number; // Opcional, solo si lo necesitas al crear o borrar
  usuarioId?: number; // El ID del usuario al que pertenece el turno
  cobertura: string;
  especialidad: string;
  profesional: number;
  fecha: Date; // O string si prefieres trabajar con fechas como cadenas
  hora: string;
  notas: string;
}

