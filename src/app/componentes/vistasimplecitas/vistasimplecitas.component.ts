import { Component, Input, OnInit } from '@angular/core';
import { Citas } from 'src/app/models';

@Component({
  selector: 'app-vistasimplecitas',
  templateUrl: './vistasimplecitas.component.html',
  styleUrls: ['./vistasimplecitas.component.scss'],
}) 
export class VistasimplecitasComponent  implements OnInit {
  @Input () cit: Citas;
  constructor() { }

  ngOnInit() {}

}
