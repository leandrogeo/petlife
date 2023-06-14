import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Admins, Citas, EstadoCita, Producto, Usuario } from 'src/app/models';
import { FirebaseauthService } from 'src/app/services/firebaseauth.service';
import { FirestoreService } from 'src/app/services/firestore.service';

@Component({
  selector: 'app-vistacitas',
  templateUrl: './vistacitas.component.html',
  styleUrls: ['./vistacitas.component.scss'],
})
export class VistacitasComponent implements OnInit {

  @Input() cit: Citas;
  estados: EstadoCita[] = ['agendado', 'atendido', 'cancelado']
  suscriberUserInfo: Subscription;
  suscriberMascotaInfo: Subscription;
  usuario: Usuario
  mascota: Producto;
  admin = false;
  uid = '';
  admin1: Admins[] = [];

  constructor(public firestoreservice: FirestoreService,
    public firebaseauthService: FirebaseauthService,
    private router: Router) {
    this.firebaseauthService.stateAuth().subscribe(res => {
      if (res !== null) {
        this.uid = res.uid;
        console.log('variios')
        console.log(this.uid)
        this.getUserInfo(this.uid);
        this.getadmin(this.uid)
      } else {
        // this.initCliente();
      }
    });

  }

  ngOnInit() {

  }

  cambioest(cita: Citas, estadocit) {
    const path = 'Usuarios/' + cita.idtutor_cita + '/Mascotas/' + cita.id_mascotacita + '/Citas/';
    const updateesta = {
      estadodelacita: estadocit.value
    };
    const id = cita.id_cita;
    this.firestoreservice.updateDoc(updateesta, path, id).then(() => {
      console.log('cambiado est con exito');
    });
  }

  getUserInfo(uid: string) {
    const path = 'Usuarios';
    this.suscriberUserInfo = this.firestoreservice.getDoc<Usuario>(path, uid).subscribe(res => {
      if (res !== undefined) {
        this.usuario = res;
      }
    });
  }

  async getadmin(uid: string) {
    await this.firestoreservice.getCollection<Admins>('Admins').subscribe(res => {
      this.admin1 = res;
      const resultado = this.admin1.filter(item => item.idusu == uid);
      if (resultado.length) {
        this.admin = true
      } else {
        this.admin = false
      }
    });
  }

  redireccionar() {
    console.log(this.cit.motivo_cita)
    if (this.cit.motivo_cita === 'Vacuna $10-15') {
      console.log('vacunaaa' + this.cit.motivo_cita)
      this.router.navigate(['/modificarvacuna/' + this.cit.id_cita]);
    } else {
      if (this.cit.motivo_cita === 'Desparacitacion $10-15') {
        console.log('despaaaaaaaa' + this.cit.motivo_cita)
        this.router.navigate(['/modificardes/' + this.cit.id_cita]);
      } else {
        console.log('resto de servicios' + this.cit.motivo_cita)
        this.router.navigate(['/modificarcitas/' + this.cit.id_cita]);
      }

    }

    // if(this.cit.motivo_cita === 'Vacuna $10-15'){

    //   this.router.navigate(['/modificarcitas/'+ this.cit.id_cita]);
    // }
  }

}
