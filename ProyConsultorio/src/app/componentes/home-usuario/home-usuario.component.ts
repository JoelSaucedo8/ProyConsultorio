import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Turno } from 'src/app/Interfaces/turno.interface';
import { TurnoService } from 'src/app/services/turno.service';
import { EspecialidadService } from 'src/app/services/especialidad.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { AgendaService } from 'src/app/services/agenda.service';


@Component({
  selector: 'app-home-usuario',
  templateUrl: './home-usuario.component.html',
  styleUrls: ['./home-usuario.component.css']
})
export class HomeUsuarioComponent implements OnInit {
  turno: Turno = {
    cobertura: '', especialidad: '',
    fecha: new Date(), hora: '', notas: '', profesional: ''
  };

  turnos: Turno[] = [];

  popupVisible = false;
  turnoSeleccionado: Turno | null = null;
  coberturas: any;
  profesionales: any;
  especialidades: any;
  agendas: any;
  horasDisponibles: any[] = [];
  usuarios: any;
  medicos: any;
  turnoespecialidad: any;

  // Propiedades para usuario y agenda
  usuarioActual: any;
  agenda: any;

  constructor(
    private router: Router,
    private turnoService: TurnoService,
    private especialidadService: EspecialidadService,
    private usuarioService: UsuarioService,
    private agendaService: AgendaService,
  ) { }

  ngOnInit() {
    this.cargarCoberturas();
    this.cargarEspecialidades();
    this.obtenerUsuarioActual();
    this.cargarHorasDisponibles();
    this.cargarTurnos();
  }

  cargarTurnos(): void {
    const userId = localStorage.getItem('userId');
    const turnosGuardados = localStorage.getItem('turnos');
  
    this.turnos = turnosGuardados ? JSON.parse(turnosGuardados) : [];
  
    if (!turnosGuardados && userId) {
      this.turnoService.getTurnos(userId).subscribe({
        next: response => {
          this.turnos = response?.payload || [];
          localStorage.setItem('turnos', JSON.stringify(this.turnos));
          console.log("Turnos cargados:", this.turnos);
        },
        error: err => console.error("Error al cargar turnos:", err.message),
      });
    } else if (!userId) {
      console.error("No se encontró el ID del usuario.");
    } else {
      console.log("Turnos cargados desde localStorage:", this.turnos);
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

  formatearFecha(fecha: Date): string {
    if (fecha instanceof Date && !isNaN(fecha.getTime())) {
      const dia = String(fecha.getDate()).padStart(2, '0'); 
      const mes = String(fecha.getMonth() + 1).padStart(2, '0'); 
      const año = fecha.getFullYear();
      return `${dia}/${mes}/${año}`; 
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
  // Validación de campos
  if (!this.turno.cobertura || !this.turno.especialidad || !this.turno.fecha
    || !this.turno.hora || !this.turno.notas) {
    alert("Por favor, complete todos los campos del turno.");
    return;
  }

  const turnoData: Turno = { ...this.turno };

  this.turnoService.guardarTurno(turnoData).subscribe({
    next: response => {
      console.log("Turno agregado con éxito:", response);
      alert("Turno agregado con éxito");  
      this.turnos.push(turnoData); 
      localStorage.setItem('turnos', JSON.stringify(this.turnos)); 
      // recargar los turnos desde el servidor
      // this.cargarTurnos(); 
    },
    error: err => {
      console.error("Error al agregar el turno:", err);
    }
  });
}
}