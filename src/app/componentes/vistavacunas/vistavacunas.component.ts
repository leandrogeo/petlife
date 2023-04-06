import { Component, Input, OnInit } from '@angular/core';
import { Vacunas } from 'src/app/models';

@Component({
  selector: 'app-vistavacunas',
  templateUrl: './vistavacunas.component.html',
  styleUrls: ['./vistavacunas.component.scss'],
})
export class VistavacunasComponent implements OnInit {
  @Input () vac: Vacunas;

  constructor() { }

  ngOnInit() {}

}
