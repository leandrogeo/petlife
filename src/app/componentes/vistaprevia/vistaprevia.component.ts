import { Component, Input, OnInit } from '@angular/core';
import { Desp, Producto } from 'src/app/models';

@Component({
  selector: 'app-vistaprevia',
  templateUrl: './vistaprevia.component.html',
  styleUrls: ['./vistaprevia.component.scss'],
})
export class VistapreviaComponent implements OnInit {

  @Input () des: Desp;


  constructor() { }

  ngOnInit() {

    console.log("la desparacitada ======"+ this.des)
  }

}
