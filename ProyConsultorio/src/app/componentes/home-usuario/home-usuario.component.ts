import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Turno } from 'src/app/interfaces/home-usuario.interface';
import { DataService } from 'src/app/services/dataservice'; 
import { TurnoService } from 'src/app/services/turno.service';
import { EspecialidadService } from 'src/app/services/especialidad.service';

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

  constructor(
    private router: Router, 
    private dataService: DataService, 
    private turnoService: TurnoService,
    private especialidadService: EspecialidadService, //  se inyecta el servicio de especialidades
  ) {}

  ngOnInit() {
    // this.cargarTurnos(); 
    this.cargarCoberturas(); 
    this.cargarEspecialidades();
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
    this.especialidadService.obtenerCoberturas().subscribe((data:any) => {
      console.log(data)
        if (data.codigo === 200) {
          this.coberturas = data; 
          console.log('Coberturas cargadas:', this.coberturas);
        } else {
          console.error('Se recibió un objeto:', data);  
          this.coberturas = []; 
        }
      }
      // error: (err) => {
      //   console.error('Error al cargar las coberturas', err);
      );
    }
  
  cargarEspecialidades() {
    this.especialidadService.obtenerEspecialidades().subscribe((data:any) =>{
        if (data) {
          this.especialidades = data; 
          console.log('Especialidades cargadas:', this.especialidades);
        } else {
          console.error('Se recibió un objeto:', data); 
          this.especialidades = []; 
        }
      }
      // error: (err) => {
      //   console.error('Error al cargar especialidades', err);
    );
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
