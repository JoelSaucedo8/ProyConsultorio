import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, map, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private isLoggedInSubject = new BehaviorSubject<boolean>(false);
  isLoggedIn$ = this.isLoggedInSubject.asObservable();

  private userName: string | null = null; // almacenar nombre de usuario logueado
  private role: string | null = null; // almacena rol de usuario
  currentRoleSubject: any;

  login(username: string, password: string): Observable<boolean> {
    console.log(`Intentando iniciar sesión con usuario: ${username} y contraseña: ${password}`);
    return of(this.getRoleBasedOnCredentials(username, password)).pipe(
        map(role => {
            console.log(`Rol encontrado: ${role}`);
            if (role) {
                this.currentRoleSubject.next(role);
                return true;
            } else {
                return false;
            }
        }),
        catchError(err => {
            console.error('Error en el login:', err);
            return of(false);
        })
    );
}

getRoleBasedOnCredentials(username: string, password: string): string | null {
  if (username === 'admin' && password === 'adminpass') return 'admin';
  if (username === 'operador' && password === 'operadorpass') return 'operador';
  if (username === 'medico' && password === 'medicopass') return 'medico';
  if (username === 'paciente' && password === 'pacientepass') return 'paciente';
  return null;
}


  logout(): void {
    this.isLoggedInSubject.next(false);
    this.userName = null; // limpia el nombre de usuario
    this.role = null; // limpia rol al iniciar sesion
  }

  getUserName(): string | null {
    return this.userName; // devuelve usuario logueado
  }

  getRole(): string | null {
    return this.role; // devuelve el rol del usuario al loguearse
  }
}
