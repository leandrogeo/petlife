import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VistapreviaComponent } from './vistaprevia/vistaprevia.component';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { VistavacunasComponent } from './vistavacunas/vistavacunas.component';
import { VistamascotasComponent } from './vistamascotas/vistamascotas.component';
import { VistacarnetmascotasComponent } from './vistacarnetmascotas/vistacarnetmascotas.component';
import { VistacitasComponent } from './vistacitas/vistacitas.component';
import { VistasimplecitasComponent } from './vistasimplecitas/vistasimplecitas.component';



@NgModule({
  declarations: [VistapreviaComponent,VistavacunasComponent,VistamascotasComponent,VistacarnetmascotasComponent,VistacitasComponent,VistasimplecitasComponent],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    RouterModule,
  ],
  exports: [
    VistapreviaComponent,
    VistavacunasComponent,
    VistamascotasComponent,
    VistacarnetmascotasComponent,
    VistacitasComponent,
    VistasimplecitasComponent
  ]
})
export class ComponentesModule { }
