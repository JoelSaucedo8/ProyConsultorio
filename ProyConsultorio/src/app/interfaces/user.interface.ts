export interface User {
    id: number;
    nombre: string;
    apellido: string;
    email: string;
    fecha: Date;
    telefono: number;
    password: string;
    rol: string; // 'operador', 'medico', 'administrador'
  }