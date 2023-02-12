import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home/home.component';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { PerfilComponent } from './perfil/perfil.component';
import { RegistrosComponent } from './registros/registros.component';
import { BuscarComponent } from './buscar/buscar.component';
import { MascotasComponent } from './mascotas/mascotas.component';
import { PerfilesmascotasComponent } from './perfilesmascotas/perfilesmascotas.component';



@NgModule({
  declarations: [
    HomeComponent,
    PerfilComponent,
    RegistrosComponent,
  BuscarComponent,
  MascotasComponent,
  PerfilesmascotasComponent],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    RouterModule,
  
  ]
})
export class PagesModule { }
