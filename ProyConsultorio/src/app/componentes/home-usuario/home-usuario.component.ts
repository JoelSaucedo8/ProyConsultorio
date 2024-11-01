import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Turno } from 'src/app/interfaces/home-usuario.interface';
import { DataService } from 'src/app/services/dataservice'; 
import { TurnoService } from 'src/app/services/turno.service';
import { EspecialidadService } from 'src/app/services/especialidad.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { AgendaService } from 'src/app/services/agenda.service';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-home-usuarios',
  templateUrl: './home-usuario.component.html',
  styleUrls: ['./home-usuario.component.css']
})
export class HomeUsuariosComponent implements OnInit {
  turno: Turno = {
    id_paciente: '', 
    cobertura: '',
    fecha: new Date(), 
    hora: '',
    profesional: '',
    especialidad: '',
    notas: '',
    agenda: '',
  };
  
  popupVisible = false;
  turnos: Turno[] = [];
  turnoSeleccionado: Turno | null = null;
  coberturas: any; 
  profesionales: any;
  especialidades: any; 
  agendas: any;
  horasDisponibles: any[]= [];
  usuarios: any;
  medicos: any;
  turnoespecialidad: any;

  // Propiedades para usuario y agenda
  usuarioActual: any;
  agenda: any;

  constructor(
    private router: Router, 
    private dataService: DataService, 
    private turnoService: TurnoService,
    private especialidadService: EspecialidadService,
    private usuarioService: UsuarioService,
    private agendaService: AgendaService 
  ) {}

  ngOnInit() {
    this.cargarCoberturas(); 
    this.cargarEspecialidades();
    this.obtenerUsuarioActual(); 
    this.cargarHorasDisponibles();
    this.cargarTurnos(); // Carga los turnos al iniciar el componente
  }

  cargarTurnos() {
    const userId = localStorage.getItem('userId'); 
    if (userId) {
      this.turnoService.getTurnos(userId).subscribe({
        next: (data) => {
          console.log('Datos recibidos de getTurnos:', data); 
          if (Array.isArray(data.payload)) {
            this.turnos = data.payload; 
          }},
        error: (err) => {
          console.error('Error al cargar los turnos', err);
        }
      });
    } else {
      console.error('User ID no disponible');  
    }
  }

  cargarCoberturas() {
    this.especialidadService.obtenerCoberturas().subscribe({
      next: coberturas => {
        this.coberturas = coberturas;
        console.log('Coberturas cargadas:', this.coberturas);
      },
      error: err => {
        console.error('Error al cargar coberturas:', err.message);
      }
    });
  }

  cargarEspecialidades() {
    this.especialidadService.obtenerEspecialidades().subscribe({
      next: especialidades => {
          this.especialidades = especialidades;
          this.especialidades = this.especialidades.payload;
          console.log('Especialidades cargadas:', this.especialidades);
      },
      error: err => {
        console.error('Error al cargar especialidades:', err.message);
      }
    });
  }

  obtenerUsuarioActual() {
    this.usuarioService.obtenerUsuarios().subscribe({
      next: usuarios => {
        this.usuarios = usuarios.payload; 
        this.usuarioActual = this.usuarios; 
        console.log('Usuario actual:', this.usuarioActual);
      },
      error: err => {
        console.error('Error al obtener usuario:', err.message);
      }
    });
  }

  obtenerAgendaMedico(idMedico: any) {
    this.agendaService.obtenerAgenda(idMedico).subscribe({
      next: agendas => {
        this.agendas = agendas.payload; 
        this.agenda = this.agendas; 
        console.log('Agenda cargada:', this.agenda);
      },
      error: err => {
        console.error('Error al cargar la agenda:', err.message);
      }
    });
  }

  obtenerEspecialidadesMedico() {
    const idMedico = this.turnoespecialidad;
    this.especialidadService.obtenerEspecialidadesMedico(idMedico).subscribe({
      next: especialidadesMedico => {
        console.log('Especialidades del médico cargadas:', especialidadesMedico);
      },
      error: err => {
        console.error('Error al cargar especialidades del médico:', err.message);
      }
    });
  }

  obtenerMedicosPorEspecialidad(idMedico: any) {
    this.especialidadService.obtenerMedicoporEspecialidad(idMedico).subscribe((data: any) => {
        console.log(data);
        if (data.payload && data.payload.length > 0) {
            this.profesionales = data.payload;
        } else {
            this.profesionales = []; 
            console.warn('No hay especialidades para este médico.');
        }
        console.log('Médicos por especialidad cargados:', this.profesionales);
    });
  }

  cargarHorasDisponibles() {
    console.log('Ejecutando cargarHorasDisponibles');
    const horas: string[] = [];
    for (let i = 8; i <= 17; i++) { 
      horas.push(`${i}:00`);  
    }
    this.horasDisponibles = horas; 
    console.log('Horas disponibles:', this.horasDisponibles);
  }

  borrarTurno(turno: Turno) {
    const confirmacion = confirm('¿Estás seguro de que deseas borrar este turno?');
    if (confirmacion) {
      this.turnoService.deleteTurno(turno.id!).subscribe({
        next: () => {
          this.turnos = this.turnos.filter(t => t !== turno);
          alert('Turno borrado con éxito');
        },
        error: (error) => {
          console.error('Error al borrar el turno:', error);
        }
      });
    }
  }

  cancelar() {
    this.router.navigate(['/']);
  }

  cerrarPopup() {
    this.popupVisible = false;
  }

  cerrarsesion() {
    localStorage.removeItem('token');
    localStorage.removeItem('userId'); 
    this.router.navigate(['/login']);
  }

  mostrarDetalles(turno: Turno) {
    this.turnoSeleccionado = turno;
  }

  cerrarDetalles() {
    this.turnoSeleccionado = null; 
  }

  home(): void {
    this.router.navigate(['/']);
  }

  formatearFecha(fecha: any): string {
    if (fecha instanceof Date && !isNaN(fecha.getTime())) {
      return fecha.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric'
      });
    } else {
      console.warn('Fecha no válida:', fecha);
      return ''; 
    }
  }
  
  onCoberturaChange() {
    // maneja el cambio de cobertura
  }

  onEspecialidadChange() {
    // maneja el cambio de especialidad
  }

  onFechaChange() {
    // maneja el cambio de fecha
  }

  agregarTurno(): void {
    // Valida si todos los campos requeridos del turno están completos
    if (!this.turno.cobertura || !this.turnoespecialidad ||!this.turno.fecha 
      || !this.turno.hora || !this.turno.notas) {
      alert("Por favor, complete todos los campos del turno.");
      return;
    }
  
    // Crear el objeto turnoData con todos los campos requeridos por la interfaz Turno
    const turnoData: Turno = {
      id_paciente: '', // Proporciona un valor predeterminado o se puede dejar vacío
      cobertura: this.turno.cobertura,
      especialidad: this.turno.especialidad,
      profesional: this.turno.profesional,
      fecha: this.turno.fecha,
      hora: this.turno.hora,
      notas: this.turno.notas,
      agenda: '', // Proporciona un valor predeterminado o se puede dejar vacío
    };
  
    // Llamada al servicio para agregar el turno
    this.turnoService.addTurno(turnoData).pipe(
      catchError(err => {
        console.error('Error al agregar el turno:', err);
        alert('Error al agregar el turno. Inténtalo nuevamente.');
        return of(null);
      })
    ).subscribe((response: any) => {
      if (response) {
        console.log("Turno agregado con éxito");
        alert("Turno agregado con éxito");
  
        // Aquí se mantiene el turno en la pantalla, no se hace reset
        // Puedes optar por mostrar el turno de alguna forma en la interfaz
        this.cargarTurnos(); // Opcional: Si necesitas cargar la lista de turnos de nuevo
  
        // Opcional: Mostrar el turno agregado en un lugar de la interfaz, si es necesario
        // Por ejemplo, agregar el turno a una lista visible en la UI
        this.turnos.push(turnoData); // Agregar el turno a la lista local
      }
    });
  }
}  