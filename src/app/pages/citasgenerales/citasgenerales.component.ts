import { Component, OnInit } from '@angular/core';
import { MenuController, ToastController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { Citas } from 'src/app/models';
import { FirebaseauthService } from 'src/app/services/firebaseauth.service';
import { FirestorageService } from 'src/app/services/firestorage.service';
import { FirestoreService } from 'src/app/services/firestore.service';

@Component({
  selector: 'app-citasgenerales',
  templateUrl: './citasgenerales.component.html',
  styleUrls: ['./citasgenerales.component.scss'],
})
export class CitasgeneralesComponent implements OnInit {

  listaagendada = false;
  listacancalados=false;
  listaatendidas=false;
  Citasagendadas: Citas[] = []
  Citasaatendidas: Citas[] = []
  Citasacanceladas: Citas[] = []
  atendidoSuscriber: Subscription;
  agendadosSuscriber: Subscription;
  canceladosSuscriber: Subscription;
  segmento = 'agendado'

  constructor(
    public menuController: MenuController,
    public firestoreservice: FirestoreService,
  ) {
    this.getCitasagendados()
  }



  ngOnInit() { }

  openMenu() {
    this.menuController.toggle('principal');
  }

  changeSegment(eve: any) {

    const opc = eve.detail.value
    if (opc === 'agendado') {
      this.segmento = 'agendado'
      this.getCitasagendados()
    }
    if (opc === 'atendido') {
      this.segmento = 'atendido'
      this.getCitasAtendidas()

    }
    if (opc === 'cancelado') {
      this.segmento = 'cancelado'
      this.getCitascanceladas()

    }
  }

  async getCitasAtendidas() {
    const path = 'Citas';
    this.atendidoSuscriber = this.firestoreservice.getCollectionAll2<Citas>(path, 'estadodelacita', '==', 'atendido').subscribe(res => {
      if (res.length) {
        this.Citasaatendidas= res
        this.listaatendidas = true
      } else {
        this.listaatendidas = false
        this.Citasaatendidas = undefined
      }
    });
  }

  async getCitasagendados() {
    const path = 'Citas';
    this.agendadosSuscriber = this.firestoreservice.getCollectionAll2<Citas>(path, 'estadodelacita', '==', 'agendado').subscribe(res => {
      if (res.length) {
        this.Citasagendadas= res
        this.listaagendada = true
      } else {
        this.listaagendada = false
        this.Citasagendadas = undefined
      }
    });

  }

  async getCitascanceladas() {
    const path = 'Citas';
    this.canceladosSuscriber = this.firestoreservice.getCollectionAll2<Citas>(path, 'estadodelacita', '==', 'cancelado').subscribe(res => {
      if (res.length) {
        this.Citasacanceladas = res
        this.listacancalados = true
      } else {
        this.listacancalados = false
        this.Citasacanceladas = undefined
      }

    });

  }


}
