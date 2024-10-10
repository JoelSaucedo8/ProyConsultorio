import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';

type Role = 'admin' | 'operador' | 'paciente';

@Injectable({
  providedIn: 'root'
})
export class PermissionService {

  constructor(private authService: AuthService) {}

  canPerformAction(action: string): boolean {
    const role = this.authService.getUserRole() as Role;  // Asegúrate de que el rol sea uno de los definidos
    
    // Define las acciones permitidas para cada rol
    const permissions: Record<Role, string[]> = {
      admin: ['view', 'edit', 'delete'],
      operador: ['view', 'edit'],
      paciente: ['view']
    };

    // Verifica si el rol tiene permiso para realizar la acción
    return permissions[role]?.includes(action) || false;
  }
}

