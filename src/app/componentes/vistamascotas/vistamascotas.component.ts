import { Component, Input, OnInit } from '@angular/core';
import { Producto } from 'src/app/models';

@Component({
  selector: 'app-vistamascotas',
  templateUrl: './vistamascotas.component.html',
  styleUrls: ['./vistamascotas.component.scss'],
})
export class VistamascotasComponent implements OnInit {

  @Input () pro: Producto;

  constructor() { }

  ngOnInit() {}

}
