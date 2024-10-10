import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private isLoggedInSubject = new BehaviorSubject<boolean>(false);
  isLoggedIn$ = this.isLoggedInSubject.asObservable();
  getUserRole: any;

  login(username: string, password: string): Observable<boolean> {
    //llamada a la API, etc
    //si el login es exitoso:
    this.isLoggedInSubject.next(true);
    return of(true); // simula que el login fue exitoso
  }

  logout(): void {
    this.isLoggedInSubject.next(false);
    // logica para cerrar sesión
  }

  getUserName(): string | null {
    return 'Nombre del usuario'; //se puede obtener el nombre del usuario logueado
  }
}
