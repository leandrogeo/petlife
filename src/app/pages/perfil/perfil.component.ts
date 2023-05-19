import { Component, OnInit } from '@angular/core';
import { AlertController, MenuController, ModalController, ToastController } from '@ionic/angular';
import { Usuario, Producto } from '../../models';
import { FirebaseauthService } from '../../services/firebaseauth.service';
import { FirestoreService } from '../../services/firestore.service';
import { FirestorageService } from '../../services/firestorage.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

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
    admin: false,
  };



  visible: boolean = true;
  changetype: boolean = true;
  uid = '';
  suscriberUserInfo: Subscription;
  ingresarEnable = false;

  constructor(public menucontroller: MenuController,
    public firebaseauthService: FirebaseauthService,
    public firestoreService: FirestoreService,
    public firestorageService: FirestorageService,
    public toastController: ToastController,
    private router: Router,
    private alertCtrl: AlertController) {

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
      admin: false,
    };

  }

  cambiodeicono() {
    this.visible = !this.visible
    this.changetype = !this.changetype
  }

  openMenu() {
    this.menucontroller.toggle('principal');
  }

  async registrarse() {
    if (this.usuario.correo !== '') {
      if (this.usuario.contrasenia !== '') {
        if (this.usuario.nombre !== '') {
          if (this.usuario.celular !== '') {
            if (this.usuario.direccion !== '') {

              const credenciales = {
                email: this.usuario.correo,
                password: this.usuario.contrasenia,

              };
              const res = await this.firebaseauthService.registrar(credenciales.email, credenciales.password)
                .catch(async error => {
                  var errormensaje = 'sin error'
                  if (error.code === 'auth/email-already-in-use') {
                    errormensaje = 'Ya existe un usuario con este correo'
                  }
                  const alert = this.alertCtrl.create({
                    //cssClass: 'my-custom-class',
                    header: 'Fallo al iniciar sesión',
                    message: errormensaje,
                    buttons: ['OK']
                  });

                  (await alert).present();
                  this.initCliente()
                });
              const uid = await this.firebaseauthService.getUid();
              this.usuario.uid = uid;
              this.guardarUser();
            } else {
              const alert = this.alertCtrl.create({
                //cssClass: 'my-custom-class',
                header: 'Fallo al registrarse',
                message: 'Por favor completar el campo "Dirrecion" ',
                buttons: ['OK']
              });

              (await alert).present();
            }
          } else {
            const alert = this.alertCtrl.create({
              //cssClass: 'my-custom-class',
              header: 'Fallo al registrarse',
              message: 'Por favor completar el campo "Telefono" ',
              buttons: ['OK']
            });

            (await alert).present();
          }
        } else {
          const alert = this.alertCtrl.create({
            //cssClass: 'my-custom-class',
            header: 'Fallo al registrarse',
            message: 'Por favor completar el campo "Nombre" ',
            buttons: ['OK']
          });

          (await alert).present();
        }
      } else {
        const alert = this.alertCtrl.create({
          //cssClass: 'my-custom-class',
          header: 'Fallo al registrarse',
          message: 'Por favor completar el campo "Contrasena" ',
          buttons: ['OK']
        });

        (await alert).present();
      }
    }
    else {
      const alert = this.alertCtrl.create({
        //cssClass: 'my-custom-class',
        header: 'Fallo al registrarse',
        message: 'Por favor completar el campo "Correo',
        buttons: ['OK']
      });

      (await alert).present();
    }





    /*
    
        */

  }

  async guardarUser() {
    const path = 'Usuarios';
    const name = this.usuario.nombre;
    this.firestoreService.createDoc(this.usuario, path, this.usuario.uid).then(res => {
    }).catch(error => {
    });
  }

  async salir() {
    this.firebaseauthService.logout();
    this.suscriberUserInfo.unsubscribe();
  }

  getUserInfo(uid: string) {
    const path = 'Usuarios';
    console.log('aquiii')
    try {
      this.suscriberUserInfo = this.firestoreService.getDoc<Usuario>(path, uid).subscribe(res => {
        if (res !== undefined) {
          this.usuario = res;
        }
      });
    } catch (error) {
      console.log('ERROR '+ error)
    }
    
  }

  ingresar() {
    const credenciales = {
      email: this.usuario.correo,
      password: this.usuario.contrasenia,
    };
    this.firebaseauthService.login(credenciales.email, credenciales.password).then(res => {
      if (res !== undefined) {
        this.presentToast('Bienvenido');
        this.router.navigate(['/home']);
      }
    })
      .catch(async error => {
        var errormensaje = 'sin error'
        if (error.code === 'auth/invalid-email') {
          errormensaje = 'El formato del correo esta mal escrito'
        }
        if (error.code === 'auth/wrong-password') {
          errormensaje = 'Contraseña incorrecta'
        }
        if (error.code === 'auth/user-not-found') {
          errormensaje = 'El correo es incorrecto o el usuario no existe'
        }
        const alert = this.alertCtrl.create({
          //cssClass: 'my-custom-class',
          header: 'Fallo al iniciar sesión',
          message: errormensaje,
          buttons: ['OK']
        });

        (await alert).present();

      });
  }

  async presentToast(msg: string) {
    const toast = await this.toastController.create({
      message: msg,
      cssClass: 'normal',
      duration: 2000,
      color: 'success',
    })
    toast.present();
  }

}
