import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Turno } from 'src/app/interfaces/home-usuario.interface';
import { DataService } from 'src/app/services/data.service';
import { TurnoService } from 'src/app/services/turno.service';
import { EspecialidadService } from 'src/app/services/especialidad.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { AgendaService } from 'src/app/services/agenda.service';
import { User } from 'src/app/interfaces/user.interface';
import { MatTableDataSource } from '@angular/material/table';
import { UserDialogComponent } from '../user-dialog/user-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { MatSelectChange } from '@angular/material/select';


@Component({
  selector: 'app-home-usuarios',
  templateUrl: './home-usuario.component.html',
  styleUrls: ['./home-usuario.component.css']
})
export class HomeUsuariosComponent implements OnInit {

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
  medicos: any;
  turnoespecialidad: any;
  usuarios: User[] = [];
  usuarioActual: User[] = [];
  agenda: any;
  displayedColumns: string[] = ['nombre', 'apellido', 'rol', 'acciones'];
  dataSource = new MatTableDataSource<User>();

  constructor(
    private router: Router,
    private dataService: DataService,
    private turnoService: TurnoService,
    private especialidadService: EspecialidadService,
    private usuarioService: UsuarioService,
    private agendaService: AgendaService,
    public dialog: MatDialog
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
        },
        error: err => console.error("Error al cargar turnos:", err.message),
      });
    } else if (!userId) {
      console.error("No se encontró el ID del usuario.");
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
    this.especialidadService.obtenerEspecialidades().subscribe({
      next: especialidades => {
        this.especialidades = especialidades;
      },
      error: err => {
        console.error('Error al cargar especialidades:', err.message);
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

  obtenerUsuarioActual() {
    this.usuarioService.obtenerUsuarios().subscribe({
      next: usuarios => {
        console.log(usuarios)
        this.dataSource.data = usuarios;
        console.log(this.dataSource.data)
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
      },
      error: err => {
        console.error('Error al cargar la agenda:', err.message);
      }
    });
  }

  cargarHorasDisponibles() {
    const horas: string[] = [];
    for (let i = 8; i <= 17; i++) {
      horas.push(`${i}:00`);
    }
    this.horasDisponibles = horas;
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

  agregarTurno(): void {
    if (!this.turno.cobertura || !this.turno.especialidad || !this.turno.fecha
      || !this.turno.hora || !this.turno.notas) {
      alert("Por favor, complete todos los campos del turno.");
      return;
    }

    const turnoData: Turno = { ...this.turno };
    this.turnoService.guardarTurno(turnoData).subscribe({
      next: response => {
        alert("Turno agregado con éxito");  
        this.turnos.push(turnoData); 
        localStorage.setItem('turnos', JSON.stringify(this.turnos));
      },
      error: err => {
        console.error("Error al agregar el turno:", err);
      }
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  openDialog(usuario?: User): void {
    const dialogRef = this.dialog.open(UserDialogComponent, {
      width: '400px',
      data: usuario ? { ...usuario } : { nombre: '', apellido: '', rol: 'operador' }
    });
  
    dialogRef.afterClosed().subscribe((result: User) => {
      if (result) {
        const usuarioServiceCall = result.id
          ? this.usuarioService.actualizarUsuario(result.id, result)
          : this.usuarioService.crearUsuario(result);
  
        usuarioServiceCall.subscribe({
          next: () => this.obtenerUsuarioActual(),
          error: err => console.error('Error al guardar usuario:', err.message)
        });
      }
    });
  }
  
  
  eliminarUsuario(usuario: User): void {
    const confirmacion = confirm('¿Estás seguro de que deseas eliminar este usuario?');
    if (confirmacion) {
      this.usuarioService.eliminarUsuario(usuario.id).subscribe({
        next: () => {
          // Actualiza la lista de usuarios tras eliminar uno
          this.obtenerUsuarioActual();
          alert('Usuario eliminado con éxito');
        },
        error: err => {
          console.error('Error al eliminar usuario:', err.message);
        }
      });
    }
  }
  

  onSelectChange(event: MatSelectChange) {
    console.log(event.value);
  }

  cerrarSesion() {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    this.router.navigate(['/login']);
  }

  cancelar() {
    this.router.navigate(['/']);
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
}
