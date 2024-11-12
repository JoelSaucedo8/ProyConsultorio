import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './componentes/home/home.component';
import { LoginComponent } from './componentes/login/login.component';
import { RegisterComponent } from './componentes/register/register.component';
import { FooterComponent } from './componentes/footer/footer.component';
import { HeaderComponent } from './componentes/header/header.component';
import { HomeUsuariosComponent } from './componentes/home-usuario/home-usuario.component';
import { roleGuard } from './guard/role.guard';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'footer', component: FooterComponent },
  { path: 'header', component: HeaderComponent },
  { path: 'home-usuario', component: HomeUsuariosComponent },
  {
    path: 'admin',
    component: HomeUsuariosComponent,
    canActivate: [roleGuard],
    data: { role: 'admin' } // Define el rol necesario para esta ruta
  },
  {
    path: 'user',
    component: HomeUsuariosComponent,
    canActivate: [roleGuard],
    data: { role: 'paciente' } // Define el rol necesario para esta ruta
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
