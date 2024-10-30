import { Component, OnInit, OnDestroy } from '@angular/core';
import { TurnoService } from 'src/app/services/turnos.service';
import { Turno } from 'src/app/Interfaces/turno.interface';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth.service';
import { Route, Router } from '@angular/router';

@Component({
  selector: 'app-home-usuario',
  templateUrl: './home-usuario.component.html',
  styleUrls: ['./home-usuario.component.css']
})
export class HomeUsuarioComponent implements OnInit, OnDestroy {
  userId!: number;
  turnos: Turno[] = [];
  turno: Turno = {
    cobertura: '',
    especialidad: '',
    profesional: '',
    fecha: new Date(),
    hora: '',
    notas: ''
  };
  isAdminUser = false;
  coberturas: string[] = [];
  especialidades: string[] = [];
  profesionales: string[] = [];
  horasDisponibles: string[] = [];
  turnoSeleccionado: Turno | null = null;
  private destroy$ = new Subject<void>();

  constructor(private turnoService: TurnoService, private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    // Cargar el ID del usuario actual
    const userId = this.authService.getUserId();
    this.isAdminUser = this.authService.isAdmin(); // Determinar si el usuario es administrador
    this.cargarTurnos();
    this.cargarCoberturas();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  cargarTurnos() {
    if (this.userId !== undefined) {
      this.turnoService.obtenerTurnos(this.userId).subscribe(
        (data: Turno[]) => this.turnos = data,
        error => this.handleError('Error al cargar los turnos', error)
      );
    }
  }

  cargarCoberturas() {
    this.turnoService.obtenerCoberturas()
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (data: string[]) => this.coberturas = data,
        error => this.handleError('Error al cargar las coberturas', error)
      );
  }

  onCoberturaChange() {
    this.turnoService.obtenerEspecialidades(this.turno.cobertura)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (data: string[]) => {
          this.especialidades = data;
          this.resetEspecialidades();
        },
        error => this.handleError('Error al cargar las especialidades', error)
      );
  }

  onEspecialidadChange() {
    this.turnoService.obtenerProfesionales(this.turno.especialidad)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (data: string[]) => {
          this.profesionales = data;
          this.resetProfesionales();
        },
        error => this.handleError('Error al cargar los profesionales', error)
      );
  }

  onFechaChange() {
    this.turnoService.obtenerHorasDisponibles(this.turno.fecha, this.turno.profesional)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (data: string[]) => this.horasDisponibles = data,
        error => this.handleError('Error al cargar las horas disponibles', error)
      );
  }

  resetTurno() {
    this.turno = { cobertura: '', especialidad: '', profesional: '', fecha: new Date(), hora: '', notas: '' };
  }

  resetEspecialidades() {
    this.turno.especialidad = '';
    this.profesionales = [];
    this.horasDisponibles = [];
  }

  resetProfesionales() {
    this.turno.profesional = '';
    this.horasDisponibles = [];
  }

  cambiarRol() {
    this.isAdminUser = !this.isAdminUser;
    alert(`Rol cambiado a ${this.isAdminUser ? 'Admin' : 'Usuario'}`);
  }

  cancelar() {
    this.authService.logout(); // Cerrar sesión
    alert('Sección cerrada.');
  }

  onSubmit(turnoForm: any) {
    // Llama a crearTurno pasando tanto userId como el objeto turno
    this.turnoService.crearTurno(this.userId!, this.turno) // Aquí pasamos ambos argumentos
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (turnoCreado: Turno) => {
          this.turnos.push(turnoCreado);
          alert('Turno agregado con éxito');
          this.resetTurno();
          turnoForm.resetForm();
          this.horasDisponibles = [];
        },
        error => this.handleError('Error al crear el turno', error)
      );
  }
  

  borrarTurno(id: number | undefined) {
    if (id === undefined) {
      console.error('No se puede borrar el turno: ID es undefined');
      alert('No se pudo borrar el turno. ID inválido.');
      return;
    }

    this.turnoService.borrarTurno(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        () => {
          this.turnos = this.turnos.filter(turno => turno.id !== id);
          alert('Turno borrado con éxito');
        },
        error => this.handleError('Error al borrar el turno', error)
      );
  }

  mostrarDetalles(turno: Turno) {
    this.turnoSeleccionado = turno;
  }

  cerrarDetalles() {
    this.turnoSeleccionado = null;
  }

  home() {
    this.router.navigate(['/home']); // Navegar a la página de inicio
    console.log("Navegando a la página de inicio");
  }

  formatearFecha(fecha: Date): string {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return new Date(fecha).toLocaleDateString('es-ES', options);
  }

  private handleError(message: string, error: any) {
    console.error(message, error);
    alert(`${message}. Error: ${error.message}`);
  }
}
