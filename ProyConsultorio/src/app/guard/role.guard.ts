import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';// Asegúrate de que la ruta al servicio sea correcta

export const roleGuard: CanActivateFn = (route, state) => {
  // Inyecta el servicio de autenticación
  const authService = inject(AuthService);

  // Obtén el rol requerido desde los datos de la ruta
  const expectedRole = route.data['role'];
  
  // Obtén el rol del usuario desde el servicio de autenticación
  const userRole = authService.getUserRole();

  // Compara el rol del usuario con el rol requerido
  if (userRole === expectedRole) {
    return true; // Permite el acceso si los roles coinciden
  } else {
    // Opcional: Redirige o muestra un mensaje si el rol no coincide
    return false; // Deniega el acceso si los roles no coinciden
  }
};
