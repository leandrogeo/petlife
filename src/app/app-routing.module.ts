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
import { CitasComponent } from './pages/citas/citas.component';
import { CarnetComponent } from './pages/carnet/carnet.component';
import { VisualizarcarnetComponent } from './pages/visualizarcarnet/visualizarcarnet.component';
import { CitasgeneralesComponent } from './pages/citasgenerales/citasgenerales.component';
import { ModificarcitaComponent } from './pages/modificarcita/modificarcita.component';
import { ReportecitasgeneralComponent } from './pages/reportecitasgeneral/reportecitasgeneral.component';
import { VistadesparacitacionComponent } from './pages/vistavacunas/vistadesparacitacion.component';
import { VistadesComponent } from './pages/vistades/vistades.component';
import { DatePipe } from '@angular/common';
import { GuardianGuard } from './guardian.guard';
import { EditarusuComponent } from './pages/editarusu/editarusu.component';
import { EdicionComponent } from './pages/edicion/edicion.component';
import { ModificarvacunaComponent } from './pages/modificarvacuna/modificarvacuna.component';
import { ModificardesComponent } from './pages/modificardes/modificardes.component';
import { RegistromascotausuComponent } from './pages/registromascotausu/registromascotausu.component';

const routes: Routes = [

  //-----------------------RUTAS----------------------
  { path: 'home', component: HomeComponent },
  { path: 'set-registro', component: SetRegistroComponent,canActivate: [GuardianGuard]  },
  { path: 'perfil', component: PerfilComponent },
  { path: 'registros', component: RegistrosComponent,canActivate: [GuardianGuard]  },
  {
    path: 'buscar', component: BuscarComponent,canActivate: [GuardianGuard]
  },
  { path: 'citasge', component: CitasgeneralesComponent,canActivate: [GuardianGuard]  },
  { path: 'mascotas/:uid', component: MascotasComponent, },
  
  { path: 'recitasge', component: ReportecitasgeneralComponent,canActivate: [GuardianGuard] },
  { path: 'editarusu/:uid', component: EditarusuComponent,canActivate: [GuardianGuard] },
  {path: 'modificar', component:  EdicionComponent,canActivate: [GuardianGuard] },


  { path: 'modificarvacuna/:id_cita', component: ModificarvacunaComponent, },
  { path: 'modificarcitas/:id_cita', component: ModificarcitaComponent, },
  { path: 'modificardes/:id_cita', component:   ModificardesComponent, },
  
  { path: 'citas', component: CitasComponent },
  { path: 'carnet', component: CarnetComponent },
  { path: 'mascotausu', component: RegistromascotausuComponent },
  { path: 'vistavac/:uid/:idmas/:idvac', component: VistadesparacitacionComponent },
  { path: 'vistades/:uid/:idmas/:iddes', component: VistadesComponent },




  { path: 'carnet/:id', component: VisualizarcarnetComponent },

  { path: 'mascotas/:uid/perfilesmascotas/:id', component: PerfilesmascotasComponent,canActivate: [GuardianGuard]  },

  { path: '', component: HomeComponent },

  { path: '**', redirectTo: 'home', pathMatch: 'full' },

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {
  cambiarfechageneral(fecha) {
    const datePipe = new DatePipe('en-US');
    let fechaFormateada = datePipe.transform(fecha, 'dd/MM/yyyy');

    return fechaFormateada
  }
}
