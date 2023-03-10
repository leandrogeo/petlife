import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { SetRegistroComponent } from './backend/set-registro/set-registro.component';
import { PerfilComponent } from './pages/perfil/perfil.component';
import { RegistrosComponent } from './pages/registros/registros.component';
import { BuscarComponent } from './pages/buscar/buscar.component';
import { MascotasComponent } from './pages/mascotas/mascotas.component';
import { PerfilesmascotasComponent } from './pages/perfilesmascotas/perfilesmascotas.component';
import { map } from 'rxjs/operators';
import { IngresoGuard } from './ingreso.guard';

const isAdmin = (next: any) => map( (user: any) =>'KpAS4RZ6JsO3w5W6FuyZoAn1k2O2' === user.uid);

const routes: Routes = [ 

  //-----------------------RUTAS----------------------
  {path: 'home',component: HomeComponent},
  {path: 'set-registro',component: SetRegistroComponent, canActivate:[IngresoGuard]},
  {path: 'perfil',component: PerfilComponent},
  {path: 'registros',component: RegistrosComponent,canActivate:[IngresoGuard] },
  {path: 'buscar',component: BuscarComponent,canActivate:[IngresoGuard] },
  {path: 'mascotas/:uid',component: MascotasComponent,canActivate:[IngresoGuard] },
  
  {path: 'mascotas/:uid/perfilesmascotas/:id',component:  PerfilesmascotasComponent,canActivate:[IngresoGuard] },
 
  {path: '',component:HomeComponent},

  {path: '**',redirectTo: 'home',pathMatch: 'full'},
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
