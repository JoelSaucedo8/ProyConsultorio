// src/app/components/home-usuario/home-usuario.component.ts
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { TurnoService } from 'src/app/services/turnos.service'; // Asegúrate que la ruta sea correcta
import { AuthService } from '../../services/auth.service';
import { Turno } from 'src/app/interfaces/turno.interface';
import { Profesional } from 'src/app/interfaces/profesional.interface'; // Asegúrate de que la ruta sea correcta


@Component({
  selector: 'app-home-usuario',
  templateUrl: './home-usuario.component.html',
  styleUrls: ['./home-usuario.component.css']
})
export class HomeUsuarioComponent implements OnInit {
  turno: Turno = { cobertura: '', especialidad: '', profesional: '', fecha: new Date(), hora: '', notas: '' };
  turnos: Turno[] = [];
  horasDisponibles: string[] = [];
  coberturas: string[] = [];
  especialidades: string[] = [];
  profesionales: Profesional[] = []; // Aquí declaramos la propiedad
  turnoSeleccionado: Turno | null = null;
  isAdminUser: boolean = false;
  usuarioNombre: string = 'Nombre Usuario';

  constructor(private turnoService: TurnoService, private authService: AuthService) {}

  ngOnInit(): void {
    this.loadCoberturas();
    this.cargarTurnos();
    this.loadProfesionales();
    this.isAdminUser = this.authService.isAdmin(); // Verifica si el usuario es admin
    this.usuarioNombre = 'Nombre de Usuario'; // O puedes cargarlo desde el servicio
  }

  loadCoberturas() {
    // Ejemplo para cargar coberturas desde un servicio
    this.turnoService.obtenerCoberturas().subscribe(coberturas => {
      this.coberturas = coberturas;
    });
  }

  loadProfesionales() {
    this.turnoService.obtenerProfesionalesPorEspecialidad(this.turno.especialidad).subscribe(profesionales => {
        this.profesionales = profesionales; // Almacena los profesionales obtenidos
    });
}


  cargarTurnos() {
    const usuarioId = this.authService.getUsuarioId(); // Asumiendo que AuthService tiene este método
    this.turnoService.obtenerTurnoPaciente(usuarioId).subscribe(turnos => {
      this.turnos = turnos;
    });
  }

  asignarTurno(turno: Turno) {
    this.turnoService.asignarTurnoPaciente(turno).subscribe(nuevoTurno => {
      this.turnos.push(nuevoTurno);
    });
  }

  actualizarTurno(turno: Turno) {
    this.turnoService.actualizarTurnoPaciente(turno).subscribe(() => {
      this.cargarTurnos(); // Recargar turnos después de actualizar
    });
  }

  eliminarTurno(turnoId: number | null) {
    if (turnoId !== null) { // Asegúrate de que turnoId no sea null
        this.turnoService.eliminarTurnoPaciente(turnoId).subscribe(() => {
            this.turnos = this.turnos.filter(t => t.id !== turnoId);
        });
    } else {
        console.error('No se puede eliminar el turno porque el ID es nulo');
    }
}


  onCoberturaChange() {
    // Aquí debes cargar las especialidades en base a la cobertura seleccionada
    this.turnoService.obtenerEspecialidadesPorCobertura(this.turno.cobertura).subscribe(especialidades => {
      this.especialidades = especialidades;
    });
  }

  onEspecialidadChange() {
    this.turnoService.obtenerProfesionalesPorEspecialidad(this.turno.especialidad).subscribe(profesionales => {
        this.profesionales = profesionales; // Guarda los profesionales en el array

        // Asegúrate de que profesionales[0] tenga la propiedad 'id' de tipo number
        if (profesionales.length > 0) {
            this.turno.profesional = profesionales[0].id; // Asegúrate que 'id' es de tipo number
        } else {
            this.turno.profesional = null; // O un valor apropiado si no hay profesionales
        }
    }, error => {
        console.error('Error al cargar los profesionales:', error);
    });
}




  onFechaChange() {
    // Cargar las horas disponibles según la fecha seleccionada
    this.loadHorasDisponibles();
  }

  loadHorasDisponibles() {
    this.turnoService.obtenerHorasDisponibles(this.turno.fecha).subscribe(horas => {
      this.horasDisponibles = horas; // Cargar horas disponibles según la fecha
    });
  }

  onSubmit(turnoForm: NgForm) {
    if (turnoForm.valid) {
      this.turno.usuarioId = this.authService.getUsuarioId(); // Asigna el ID del usuario

      this.turnoService.crearTurno(this.turno).subscribe(response => {
        console.log('Turno creado:', response);
        this.cargarTurnos(); // Recargar turnos después de crear uno nuevo
        turnoForm.reset();
      }, error => {
        console.error('Error al crear el turno', error);
      });
    }
  }

  mostrarDetalles(turno: Turno) {
    this.turnoSeleccionado = turno;
  }

  cerrarDetalles() {
    this.turnoSeleccionado = null;
  }

  cancelar() {
    // Lógica para cancelar la operación o cerrar sección
  }

  cambiarRol() {
    this.isAdminUser = !this.isAdminUser;
  }

  formatearFecha(fecha: string) {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return new Date(fecha).toLocaleDateString('es-ES', options);
  }

  home() {
    // Lógica para regresar a la página principal
  }
}
