// En tu interfaz home-usuario.interface.ts
export interface Turno {
<<<<<<< HEAD
  id_paciente: any;
  cobertura: any;
  id?: string | null; 
  fecha: Date;
  hora: string;
  // profesional: string;
  // especialidad: string;
  notas: string; 
=======
  fecha: Date;
  hora: string;
  profesional: string;
  especialidad: string;
  notas: string;
  id: string;
  id_paciente: string;
  eliminado?: boolean; 
>>>>>>> 0520af96382c6aa0bdf6ed7fc66375b3fecc30ef
}

