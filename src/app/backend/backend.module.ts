import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SetRegistroComponent } from './set-registro/set-registro.component';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';



@NgModule({
  declarations: [SetRegistroComponent],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule
  ]
})
export class BackendModule { }
