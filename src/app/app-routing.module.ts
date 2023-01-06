import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { SetRegistroComponent } from './backend/set-registro/set-registro.component';
import { PerfilComponent } from './pages/perfil/perfil.component';

const routes: Routes = [

  //-----------------------RUTAS----------------------
  {path: 'home',component: HomeComponent},
  {path: 'set-registro',component: SetRegistroComponent},
  {path: 'perfil',component: PerfilComponent},
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
