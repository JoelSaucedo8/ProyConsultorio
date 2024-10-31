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
    notas: '',
  };
  
  popupVisible = false;
  turnos: Turno[] = [];
  turnoSeleccionado: Turno | null = null;
  coberturas: any; 
  especialidades: any[] = []; 
  horasDisponibles: any;

  // Nueva propiedad para usuario y agenda
  usuarioActual: any;
  agenda: any;

  constructor(
    private router: Router, 
    private dataService: DataService, 
    private turnoService: TurnoService,
    private especialidadService: EspecialidadService,
    private usuarioService: UsuarioService,
    private agendaService: AgendaService // Inyecta el servicio de agenda
  ) {}

  ngOnInit() {
    // this.cargarTurnos(); 
    this.cargarCoberturas(); 
    this.cargarEspecialidades();
    this.obtenerUsuarioActual(); 
    this.obtenerAgendaMedico(); 
  }

  cargarTurnos() {
    const userId = localStorage.getItem('userId'); 
    if (userId) {
      this.turnoService.getTurnos(userId).subscribe({
        next: (data) => {
          this.turnos = data; // se asigna a los turnos obtenidos
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
      },
      error: err => {
        console.error('Error al cargar coberturas:', err.message);
      }
    });
  }
  
  cargarEspecialidades() {
    this.especialidadService.obtenerEspecialidades().subscribe((data: any) => {
      if (data) {
        this.especialidades = data; 
        console.log('Especialidades cargadas:', this.especialidades);
      } else {
        console.error('Se recibió un objeto :', data); 
        this.especialidades = []; 
      }
    });
  }

  obtenerUsuarioActual() {
    const userIdString = localStorage.getItem('userId');
    if (userIdString) {
      const userId = Number(userIdString); 
      this.usuarioService.obtenerUsuario(userId).subscribe({
        next: (data) => {
          if (data.codigo === 200) {
            this.usuarioActual = data.payload[0]; 
            console.log('Usuario actual:', this.usuarioActual);
          } else {
            console.error('Error al obtener usuario:', data.mensaje);
          }
        },
        error: (err) => {
          console.error('Error al cargar el usuario actual', err);
        }
      });
    } else {
      console.error('User ID no disponible');
    }
  }
  
  obtenerAgendaMedico() {
    const idMedico = this.usuarioActual?.id; // Asumiendo que tienes el ID del médico
    if (idMedico) {
      this.agendaService.obtenerAgenda(idMedico).subscribe({
        next: (data) => {
          this.agenda = data; // Guarda la agenda
          console.log('Agenda cargada:', this.agenda);
        },
        error: (err) => {
          console.error('Error al cargar la agenda:', err);
        }
      });
    } else {
      console.error('ID de médico no disponible');
    }
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
    // manejar el cambio de cobertura
  }

  onEspecialidadChange() {
    // manejar el cambio de especialidad
  }

  onFechaChange() {
    // manejar el cambio de fecha
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
      notas: '',
    };
  }
}
