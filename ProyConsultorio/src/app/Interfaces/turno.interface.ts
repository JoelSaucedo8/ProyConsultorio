export interface Turno {
    id?: number; // Opcional si el ID es autogenerado
    fecha: Date;
    hora: string;
    cobertura: string; // Cobertura del turno (por ejemplo, consulta médica, terapia, etc.)
    profesional: string;
    especialidad: string;
    notas?: string; // Opcional
}
