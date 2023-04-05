import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VistapreviaComponent } from './vistaprevia/vistaprevia.component';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [VistapreviaComponent],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    RouterModule,
  ],
  exports: [
    VistapreviaComponent
  ]
})
export class ComponentesModule { }
