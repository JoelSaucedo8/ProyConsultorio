// En tu interfaz home-usuario.interface.ts
export interface Turno {
  fecha: Date;
  hora: string;
  profesional: string;
  especialidad: string;
  notas: string;
  id: string;
  id_paciente: string;
  eliminado?: boolean; 
}

