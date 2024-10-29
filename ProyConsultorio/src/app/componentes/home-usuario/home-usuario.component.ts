import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

interface Turno {
  fecha: Date;
  hora: string;
  profesional: string;
  especialidad: string;
  notas: string;
}
@Component({
  selector: 'app-home-usuarios',
  templateUrl: './home-usuario.component.html',
  styleUrls: ['./home-usuario.component.css']
})

export class HomeUsuarioComponent implements  OnInit{
  userRole: string = '';


  // Listado de coberturas, especialidades, profesionales y horas disponibles
  coberturas = ['Cobertura A', 'Cobertura B', 'Cobertura C']; // Ejemplo de coberturas
  especialidades = ['Cardiología', 'Pediatría', 'Dermatología']; // Ejemplo de especialidades
  profesionales = ['Dr. Juan Pérez', 'Dr. Ana Lopez', 'Dra. María González']; // Ejemplo de profesionales
  horasDisponibles = ['09:00', '10:00', '11:00', '14:00', '15:00']; // Horas disponibles

  // Objeto para el formulario de solicitud de turno
  turno = {
    cobertura: '',
    especialidad: '',
    profesional: '',
    fecha: '',
    hora: '',
    notas: '', // Campo de notas en el formulario
  };

  // Control de popup de confirmación
  popupVisible = false;
  home: any;

  // Arreglo de turnos
  turnos: Turno[] = [
    {
      fecha: new Date('2024-09-30'),
      hora: '15:00',
      profesional: 'Dr. Pedro Luis Pérez',
      especialidad: 'Traumatología',
      notas: 'Traer estudios anteriores' // Notas para el primer turno
    },
    {
      fecha: new Date('2024-10-05'),
      hora: '10:00',
      profesional: 'Dra. Ana María López',
      especialidad: 'Dermatología',
      notas: 'Consultar sobre tratamiento de la piel' // Notas para el segundo turno
    }
  ];

  // Turno seleccionado para mostrar detalles
  turnoSeleccionado: Turno | null = null;

  constructor(private router: Router, public authService: AuthService) {}

  ngOnInit(): void {
    this.userRole = this.authService.getUserRole(); // Obtener el rol del usuario
  }

  isAdmin(): boolean {
    return this.authService.isAdmin(); // Comprobar si es admin
  }
  
  // Método para borrar un turno
  borrarTurno(turno: Turno) {
    const confirmacion = confirm('¿Estás seguro de que deseas borrar este turno?');
    if (confirmacion) {
      this.turnos = this.turnos.filter(t => t !== turno);
    }
  }

  // Método para manejar cambios en la cobertura
  onCoberturaChange() {
    // Lógica para actualizar especialidades basadas en la cobertura seleccionada
  }

  // Método para manejar cambios en la especialidad
  onEspecialidadChange() {
    // Lógica para actualizar profesionales basados en la especialidad seleccionada
  }

  // Método para manejar cambios en la fecha
  onFechaChange() {
    // Lógica para actualizar horas disponibles basadas en la fecha seleccionada
  }

  // Método que se ejecuta al enviar el formulario de turno
  onSubmit() {
    // Validar que el formulario esté completo antes de agregar el turno
    if (this.turno.cobertura && this.turno.especialidad && this.turno.profesional && this.turno.fecha && this.turno.hora && this.turno.notas) {
      // Crear un nuevo objeto de tipo Turno
      const nuevoTurno: Turno = {
        fecha: new Date(this.turno.fecha), // Convertir la fecha a Date
        hora: this.turno.hora,
        profesional: this.turno.profesional,
        especialidad: this.turno.especialidad,
        notas: this.turno.notas // Añadir la nota al nuevo turno
      };

      // Agregar el nuevo turno al arreglo de turnos
      this.turnos.push(nuevoTurno);

      // Limpiar el formulario
      this.turno = {
        cobertura: '',
        especialidad: '',
        profesional: '',
        fecha: '',
        hora: '',
        notas: '',
      };

      // Cerrar el popup de confirmación si es necesario
      this.popupVisible = false;

      // Mostrar mensaje o realizar alguna otra acción después de la creación del turno
      alert('Turno agregado con éxito');
    } else {
      alert('Por favor, complete todos los campos antes de enviar el formulario.');
    }
  }

  // Método para cancelar el registro de turno y regresar a la pantalla principal
  cancelar() {
    // Navegar a la página principal
    this.router.navigate(['/']);
  }

  // Método para cerrar el popup de confirmación
  cerrarPopup() {
    // Cerrar el popup
    this.popupVisible = false;
  }

  // Método para mostrar los detalles del turno seleccionado
  mostrarDetalles(turno: Turno) {
    this.turnoSeleccionado = turno;
  }
  // Método para cerrar la vista de detalles del turno
  cerrarDetalles() {
    this.turnoSeleccionado = null; // Restablecer la selección
  }

  // Método para formatear la fecha en formato "es-ES" (español)
  formatearFecha(fecha: Date): string {
    return fecha.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
}