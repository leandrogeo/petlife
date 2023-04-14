import { Component, Input, OnInit } from '@angular/core';
import { Subscribable, Subscription } from 'rxjs';
import { Citas, EstadoCita, Producto, Usuario } from 'src/app/models';
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

  constructor(public firestoreservice: FirestoreService,
    public firebaseauthService: FirebaseauthService) {
    this.firebaseauthService.stateAuth().subscribe(res => {
      if (res !== null) {
        this.uid = res.uid;
        console.log('variios')
        console.log(this.uid)
        this.getUserInfo(this.uid);
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
        console.log(res)
        if (this.usuario.admin === true) {
          this.admin = true;
          console.log('siesadmin')
        } else {
          this.admin = false
          console.log('noesadmin')
        }
      }
    });
    
  }

}
