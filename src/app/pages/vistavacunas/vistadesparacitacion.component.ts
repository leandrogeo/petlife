import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Vacunas } from 'src/app/models';
import { FirestoreService } from 'src/app/services/firestore.service';

@Component({
  selector: 'app-vistadesparacitacion',
  templateUrl: './vistadesparacitacion.component.html',
  styleUrls: ['./vistadesparacitacion.component.scss'],
})
export class VistadesparacitacionComponent implements OnInit {

  constructor(
    private activateroute: ActivatedRoute,
    public firestoreservice: FirestoreService,
  ) { }
  uid: string;
  idmascota: string;
  idvacuna: string;

  vacuna: Vacunas = {
    id_vac: '',
    fecha_vac: '',
    peso_vac: '',
    vacunas: '',
    proxi_vac: '',
  }

  ngOnInit() {
    this.uid = this.activateroute.snapshot.paramMap.get('uid')
    this.idmascota = this.activateroute.snapshot.paramMap.get('idmas')
    this.idvacuna = this.activateroute.snapshot.paramMap.get('idvac')
    this.getvacuna();
  }


  getvacuna() {
    const path = 'Usuarios/' + this.uid + '/Mascotas/' + this.idmascota + '/Vacunacion/';
    this.firestoreservice.getDoc<Vacunas>(path, this.idvacuna).subscribe(res => {
      if (res !== undefined) {
        this.vacuna = res;
      }
    });
  }

}
