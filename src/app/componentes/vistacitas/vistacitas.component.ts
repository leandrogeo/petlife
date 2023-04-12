import { Component, Input, OnInit } from '@angular/core';
import { Citas, EstadoCita } from 'src/app/models';
import { FirestoreService } from 'src/app/services/firestore.service';

@Component({
  selector: 'app-vistacitas',
  templateUrl: './vistacitas.component.html',
  styleUrls: ['./vistacitas.component.scss'],
})
export class VistacitasComponent implements OnInit {

  @Input () cit: Citas;
  estados: EstadoCita[] = ['agendado' , 'atendido' , 'cancelado']

  constructor(public firestoreservice: FirestoreService,) { }

  ngOnInit() {}

  cambioest(cita: Citas, estadocit) {
    const path = 'Usuarios/' + cita.idtutor_cita + '/Mascotas/' + cita.id_mascotacita +'/Citas/' ;
    const updateesta = {
      estadodelacita : estadocit.value
    };
    const id = cita.id_cita;
    this.firestoreservice.updateDoc(updateesta, path, id).then(() => {
      console.log('cambiado est con exito');
    });
  }

}
