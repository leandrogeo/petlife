import { Component, Input, OnInit } from '@angular/core';
import { Producto } from 'src/app/models';

@Component({
  selector: 'app-vistacarnetmascotas',
  templateUrl: './vistacarnetmascotas.component.html',
  styleUrls: ['./vistacarnetmascotas.component.scss'],
})
export class VistacarnetmascotasComponent implements OnInit {

  @Input () pro: Producto;
  constructor() { }

  ngOnInit() {}

}
