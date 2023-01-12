import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-registros',
  templateUrl: './registros.component.html',
  styleUrls: ['./registros.component.scss'],
})
export class RegistrosComponent implements OnInit {

  opcion:string;
  constructor(public menucontroller: MenuController,
  ) { }

  ngOnInit() {}
  
  openMenu() {
    console.log('open menu');
    this.menucontroller.toggle('principal');
  }

  cambio(opcion){
    console.log(opcion)
  }
  

}
