import { Component, OnInit } from '@angular/core';
import { MenuController, ModalController } from '@ionic/angular';
import { Usuario } from '../../models';
import { FirebaseauthService } from '../../services/firebaseauth.service';
import { FirestoreService } from '../../services/firestore.service';
import { FirestorageService } from '../../services/firestorage.service';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.scss'],
})
export class PerfilComponent implements OnInit {

  usuario:Usuario={
    uid:'',
    correo:'',
    contrasenia:'',
    celular:'',
    direccion:'',
    nombre:'',
  };

  newFile: any;
  uid = '';
  //suscriberUserInfo: Subscription;
  ingresarEnable = false;

  constructor(public menucontroller: MenuController,
              public firebaseauthService: FirebaseauthService,
              public firestoreService: FirestoreService,
              public firestorageService: FirestorageService,
              private modalController: ModalController) { }

  ngOnInit() {}
  openMenu() {
    console.log('open menu');
    this.menucontroller.toggle('principal');
  }

}
