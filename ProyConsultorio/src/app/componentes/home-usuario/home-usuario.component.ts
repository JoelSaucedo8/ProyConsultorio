import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Turno } from 'src/app/interfaces/home-usuario.interface';
import { DataService } from 'src/app/services/dataservice'; 
import { AuthService } from 'src/app/services/auth.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TurnoService } from 'src/app/services/turno.service';

@Component({
  selector: 'app-home-usuarios',
  templateUrl: './home-usuario.component.html',
  styleUrls: ['./home-usuario.component.css']
})
export class HomeUsuariosComponent implements OnInit {
  // lista
  coberturas = ['Cobertura A', 'Cobertura B', 'Cobertura C'];
  especialidades = ['Cardiología', 'Pediatría', 'Dermatología'];
  profesionales = ['Dr. Juan Pérez', 'Dr. Ana Lopez', 'Dra. María González'];
  horasDisponibles = ['09:00', '10:00', '11:00', '14:00', '15:00'];

  // formulario de solicitud de turno
  turno = {
    cobertura: '',
    especialidad: '',
    profesional: '',
    fecha: '',
    hora: '',
    notas: '',
  };

  // popup de confirmacion
  popupVisible = false;
  turnos: Turno[] = []; // array vacío

  turnoSeleccionado: Turno | null = null;
userName: any;
event: KeyboardEvent | undefined;
turnoForm: FormGroup;
id: any= localStorage.getItem('id');

constructor(private router: Router, private dataService: DataService, private authService: AuthService, 
  private formbuilder:FormBuilder, private turnoservice:TurnoService) 
{
  this.turnoForm = this.formbuilder.group
({
  agenda: '',
  cobertura: '',
  fecha: '',
  hora: '',
  notas: '',

})
}

  ngOnInit() {
    this.cargarTurnos(); // carga el turno al iniciar el componente
  }

  // cargar los turnos desde el backend
  cargarTurnos() {
    this.dataService.getData().subscribe({
      next: (data) => {
        // acceder a la propiedad correcta que contiene el array de turnos
        this.turnos = data.turnos || []; // Usar un array vacío como fallback
      },
      error: (err) => {
        console.error('Error al cargar los turnos', err);
      }
    });
  }
    
  // borrar un turno
  borrarTurno(turno: Turno) {
    const confirmacion = confirm('¿Estás seguro de que deseas borrar este turno?');
    if (confirmacion) {
      this.turnos = this.turnos.filter(t => t !== turno);
      // acá se puede agregar una llamada al servicio para borrar el turno en el backend
    }
  }
  
  crearTurnos(){ 
    let body = {
      nota:this.turnoForm.controls['notas'].value , 
      id_agenda: this.turnoForm.controls['agenda'].value,
      fecha:this.turnoForm.controls['fecha'].value,
      hora: this.turnoForm.controls['hora'].value,
      id_paciente: this.id,
      id_cobertura: this.turnoForm.controls['cobertura'].value} 
    this.turnoservice.addTurno(body).subscribe((data:any)=> {
      console.log(data)
    })
  }

  // cambios en la cobertura
  onCoberturaChange() {
    // especialidades en la cobertura seleccionada
  }

  // cambios en la especialidad
  onEspecialidadChange() {
    // profesionales basados en la especialidad seleccionada
  }

  onEnter(event: KeyboardEvent) {
    event.preventDefault();
    // agregar lógica adicional si deseas hacer algo específico al presionar Enter
  }
  
  // cambios en la fecha
  onFechaChange() {
    // horas disponibles en la fecha seleccionada
  }
  // se ejecuta al enviar el formulario de turno
  // onSubmit() {
  //   if (this.turno.cobertura && this.turno.especialidad && this.turno.profesional && this.turno.fecha && this.turno.hora && this.turno.notas) {
  //     const nuevoTurno: Turno = {
  //       fecha: new Date(this.turno.fecha),
  //       hora: this.turno.hora,
  //       profesional: this.turno.profesional,
  //       especialidad: this.turno.especialidad,
  //       notas: this.turno.notas,
  //       id: '',
  //       id_paciente: '',
  //     };

  //     this.turnos.push(nuevoTurno);

  //     this.turno = {
  //       cobertura: '',
  //       especialidad: '',
  //       profesional: '',
  //       fecha: '',
  //       hora: '',
  //       notas: '',
  //     };

  //     this.popupVisible = false;

  //     alert('Turno agregado con éxito');
  //   } else {
  //     alert('Por favor, complete todos los campos antes de enviar el formulario.');
  //   }
  // }

  // cancela y vuelve a la pantalla principal
  cancelar() {
    this.router.navigate(['/']);
  }

  // popup de confirmacion
  cerrarPopup() {
    this.popupVisible = false;
  }

  mostrarDetalles(turno: Turno) {
    this.turnoSeleccionado = turno;
  }

  cerrarDetalles() {
    this.turnoSeleccionado = null; 
  }

  // vuelve pag principal
  home(): void {
    this.router.navigate(['/']);
  }

  // fecha en español
  formatearFecha(fecha: Date): string {
    return fecha.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
}
