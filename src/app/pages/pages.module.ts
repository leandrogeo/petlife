import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home/home.component';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { PerfilComponent } from './perfil/perfil.component';
import { RegistrosComponent } from './registros/registros.component';



@NgModule({
  declarations: [
    HomeComponent,
    PerfilComponent,
    RegistrosComponent],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    RouterModule
  ]
})
export class PagesModule { }
