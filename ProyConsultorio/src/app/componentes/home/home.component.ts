import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent {
  isLoggedIn$: Observable<boolean>;
  currentProfessionalIndex: number = 0; // indice del profesional actual

  professionals = [
    {
      name: 'Dr. Juan Pérez',
      // age: 45,
      specialty: '- Cardiólogo',
      description: `Lo que más me gusta de mi profesión es poder ayudar a mis pacientes a mejorar su calidad de vida. Cada día,
      tengo la oportunidad de hacer la diferencia real en la salud de las personas, y eso me motiva a seguir
      aprendiendo y creciendo en mi especialidad. Me apasiona la cardiología porque me permite combinar mi amor por
      la ciencia con el deseo de brindar cuidado y apoyo a quienes más lo necesitan.`,
      image: 'assets/imagenes/doctor1.jpeg',
    },
    {
      name: 'Dra. Ana López',
      // age: 38,
      specialty: '- Pediatra',
      description: `Lo que más me gusta de mi profesión es poder acompañar a los niños y sus familias en su crecimiento y desarrollo.
      Cada día, me esfuerzo por crear un ambiente seguro y cariñoso para mis pequeños pacientes, y eso me llena de alegría.
      La pediatría me permite combinar mi amor por la medicina con mi deseo de hacer una diferencia positiva en la vida de los niños.
      Estoy comprometida a educar a los padres sobre la salud y el bienestar de sus hijos, y a asegurarme de que cada niño tenga la atención que merece.`,
      image: 'assets/imagenes/doctor2.jpeg',
    },
    {
      name: 'Dra. María González',
      // age: 40,
      specialty: '- Dermatóloga',
      description: `Mi pasión por la dermatología me permite ayudar a mis pacientes a cuidar su piel y autoestima.`,
      image: 'assets/imagenes/doctor3.jpg',
    }
  ];
home: any;

  constructor(private authService: AuthService) {
    this.isLoggedIn$ = this.authService.isLoggedIn$; 
  }

  openLoginPopup(): void {
    // logica para abrir un pop-up de inicio de sesión
  }

  nextProfessional(): void {
    // cambiar al siguiente profesional
    this.currentProfessionalIndex = (this.currentProfessionalIndex + 1) % this.professionals.length; // Vuelve al inicio al llegar al final
  }

  previousProfessional(): void {
    // cambiar al profesional anterior
    this.currentProfessionalIndex = (this.currentProfessionalIndex - 1 + this.professionals.length) % this.professionals.length; // Vuelve al final si está en el inicio
  }  
}
