import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private isLoggedInSubject = new BehaviorSubject<boolean>(false);
  isLoggedIn$ = this.isLoggedInSubject.asObservable();

  private userName: string | null = null; // almacenar nombre de usuario logueado
  private role: string | null = null; // almacena rol de usuario

  login(username: string, password: string): Observable<boolean> {
    const role = this.getRoleBasedOnCredentials(username, password);
    if (role) {
      this.userName = username; // asigna nombre de usuario
      this.role = role; // asigna rol
      this.isLoggedInSubject.next(true);
      return of(true); // retorna mensaje exitoso
    } else {
      return of(false); //retorna falso si los datos no son correctos
    }
  }

  getRoleBasedOnCredentials(username: string, password: string): string | null {
    if (username === 'admin' && password === 'adminpass') return 'admin';
    if (username === 'operador' && password === 'operadorpass') return 'operador';
    if (username === 'medico' && password === 'medicopass') return 'medico';
    if (username === 'paciente' && password === 'pacientepass') return 'paciente';
    return null; // retorna null al no encontrar rol
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
