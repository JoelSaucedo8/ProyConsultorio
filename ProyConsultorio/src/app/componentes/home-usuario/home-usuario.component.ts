import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Turno } from 'src/app/interfaces/home-usuario.interface';
import { DataService } from 'src/app/services/dataservice'; 
import { TurnoService } from 'src/app/services/turno.service';
import { EspecialidadService } from 'src/app/services/especialidad.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { AgendaService } from 'src/app/services/agenda.service';

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
  horasDisponibles: any;
  usuarios: any;
  medicos: any;
  turnoespecialidad:any;

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
  }

  cargarTurnos() {
    const userId = localStorage.getItem('userId'); 
    if (userId) {
      this.turnoService.getTurnos(userId).subscribe({
        next: (data) => {
          this.turnos = data; 
        },
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
          this.especialidades= especialidades;
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
        this.usuarios = usuarios.payload; // Asegúrate de acceder correctamente al payload
        this.usuarioActual = this.usuarios; // Ajusta si es necesario
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
    const idMedico=this.turnoespecialidad;
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
    this.especialidadService.obtenerMedicoporEspecialidad(idMedico).subscribe((data:any) => {
      console.log(data)
        this.profesionales = data.payload;
        console.log('Médicos por especialidad cargados:', this.profesionales);
    });
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

  formatearFecha(fecha: Date): string {
    return fecha.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  onCoberturaChange() {
    // Maneja el cambio de cobertura
  }

  onEspecialidadChange() {
    // Maneja el cambio de especialidad
  }

  onFechaChange() {
    // Maneja el cambio de fecha
  }

  agregarTurno() {
    this.turnoService.addTurno(this.turno).subscribe({
      next: () => {
        alert('Turno agregado con éxito');
        this.cargarTurnos();
        this.cerrarPopup(); 
      },
      error: (error: any) => {
        console.error('Error al agregar el turno:', error);
      }
    });
  }

  resetTurno() {
    this.turno = {
      id_paciente: '',
      cobertura: '',
      fecha: new Date(),
      hora: '',
      profesional: '',
      especialidad: '',
      notas: '',
      agenda: '',
    };
  }
}
