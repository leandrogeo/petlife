import { Component, OnInit } from '@angular/core';
import { MenuController, ModalController } from '@ionic/angular';
import { Usuario } from '../../models';
import { FirebaseauthService } from '../../services/firebaseauth.service';
import { FirestoreService } from '../../services/firestore.service';
import { FirestorageService } from '../../services/firestorage.service';
import { Subscription } from 'rxjs';
 
@Component({ 
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.scss'],
})
export class PerfilComponent implements OnInit {

  usuario: Usuario = {
    uid: '',
    correo: '',
    contrasenia: '',
    celular: '', 
    direccion: '',
    nombre: '',
    admin:false
  };

  uid = '';
  suscriberUserInfo: Subscription;
  ingresarEnable = false;

  constructor(public menucontroller: MenuController,
    public firebaseauthService: FirebaseauthService,
    public firestoreService: FirestoreService,
    public firestorageService: FirestorageService,
    private modalController: ModalController) {

    this.firebaseauthService.stateAuth().subscribe(res => {
      if (res !== null) {
        this.uid = res.uid;
        this.getUserInfo(this.uid);
      } else {
        this.initCliente();
      }
    });
  }

  async ngOnInit() {
    const uid = await this.firebaseauthService.getUid();
  }

  initCliente() {
    this.uid = '';
    this.usuario = {
      uid: '',
      correo: '',
      contrasenia: '',
      celular: '',
      direccion: '',
      nombre: '',
      admin:false
    };
    console.log(this.usuario);
  }


  openMenu() {
    console.log('open menu');
    this.menucontroller.toggle('principal');
  }

  async registrarse() {
    const credenciales = {
      email: this.usuario.correo,
      password: this.usuario.contrasenia,

    };
    const res = await this.firebaseauthService.registrar(credenciales.email, credenciales.password).catch(err => {
      console.log('error -> ', err);
    });
    const uid = await this.firebaseauthService.getUid();
    this.usuario.uid = uid;
    this.guardarUser();

  }

  async guardarUser() {
    const path = 'Usuarios';
    const name = this.usuario.nombre;
    this.firestoreService.createDoc(this.usuario, path, this.usuario.uid).then(res => {
      console.log('guardado con exito');
    }).catch(error => {
    });
  }

  async salir() {
    this.firebaseauthService.logout();
    this.suscriberUserInfo.unsubscribe();
  }

  getUserInfo(uid: string) {
    console.log('getUserInfo');
    const path = 'Usuarios';
    this.suscriberUserInfo = this.firestoreService.getDoc<Usuario>(path, uid).subscribe(res => {
      if (res !== undefined) {
        this.usuario = res;
      }
    });
  }

  ingresar() {
    const credenciales = {
      email: this.usuario.correo,
      password: this.usuario.contrasenia,
    };
    this.firebaseauthService.login(credenciales.email, credenciales.password).then( res => {
         console.log('ingreso con exito');
    });
 }

}
