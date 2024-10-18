import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

// Definir el guard utilizando la función CanActivateFn
export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);  // Inyectar el servicio de autenticación
  const router = inject(Router);  // Inyectar el enrutador

  const expectedRole = route.data['role'];  // Obtener el rol esperado de la ruta
  const userRole = authService.getUserRole();  // Obtener el rol del usuario autenticado

  // Depuración
  console.log('Rol esperado:', expectedRole);
  console.log('Rol del usuario:', userRole);

  if (userRole === expectedRole) {
    return true;  // Permitir acceso
  } else {
    console.warn('Acceso denegado: Redirigiendo a /guest');
    router.navigate(['/guest']);  // Redirigir a guest si no tiene el rol adecuado
    return false;
  }
};
