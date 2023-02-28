import { Component, OnInit } from '@angular/core';
import { AlertController, LoadingController, MenuController, ToastController } from '@ionic/angular';
import { stringify } from 'querystring';
import { Producto } from 'src/app/models';
import { FirestoreService } from '../../services/firestore.service';
import { FirestorageService } from '../../services/firestorage.service';
import { FirebaseauthService } from '../../services/firebaseauth.service';
import { Usuario } from '../../models';
import { Subscription } from 'rxjs';
import { Console } from 'console';


@Component({
  selector: 'app-set-registro',
  templateUrl: './set-registro.component.html',
  styleUrls: ['./set-registro.component.scss'], 
})
export class SetRegistroComponent implements OnInit {

  usuario: Usuario = {
    uid: '',
    correo: '',
    contrasenia: '',
    celular: '',
    direccion: '',
    nombre: '',
    admin:false
  };
  suscriberUserInfo: Subscription;
  productos: Producto[] = [];
  listallena = true;
  newProducto: Producto;
  enableNewProducto = false;
  //private path = 'Mascotas/';
  newImage = '';
  newFile: any;
  loading: any;
  uid = '';
  private path1= "";
  opcion:string;

  constructor(
    public menuController: MenuController,
    public firebaseauthService: FirebaseauthService,
    public firestoreservice: FirestoreService,
    public firestoreService: FirestoreService,
    public loadingController: LoadingController,
    public toastController: ToastController,
    public alertController: AlertController,
    public firestorageservice: FirestorageService) {

    this.firebaseauthService.stateAuth().subscribe(res => {
      if (res !== null) {
        console.log("constructor");
        this.uid = res.uid;
        this.getUserInfo(this.uid);
        this.path1= 'Usuarios/' + this.uid + '/Mascotas/'; 
      } else {
        console.log(this.uid); 
      }
    });
  }


  async ngOnInit() {
    const uid1 = await this.firebaseauthService.getUid();
    const path = 'Usuarios/' + uid1 + '/Mascotas/';
    console.log('isinit '+path)
  this.getProductos(path);

  }

  getUserInfo(uid: string) {
    const path = 'Usuarios';
    this.suscriberUserInfo = this.firestoreService.getDoc<Usuario>(path, uid).subscribe(res => {
      if (res !== undefined) {
        this.usuario = res;
      }
    });
  }

  cambio(opcion){
    console.log(opcion)
    this.newProducto.sexo= this.opcion;
  }

  openMenu() {
    console.log('open menu');
    this.menuController.toggle('principal');
  }

  async guardarProducto() {
    this.presentLoading();
    this.newProducto.tutor = this.usuario.nombre
    this.newProducto.telefonotutor = this.usuario.celular
    const uid = await this.firebaseauthService.getUid();
    const path = 'Usuarios/' + uid + '/Mascotas/';
    const name = this.newProducto.nombredelamascota;

    if (this.newFile !== undefined) {
      const res = await this.firestorageservice.uploadImage(this.newFile, path, name);
      this.newProducto.foto = res;
    }
    this.firestoreservice.createDoc(this.newProducto, path, this.newProducto.id).then(res => {
      this.loading.dismiss();
      this.presentToast('Guardo con exito');
      this.nuevo();
      this.enableNewProducto = false
    }).catch(error => {
      this.presentToast('No se pude guardar');
    });
  }
 
//Revisra en el buscar usuarios
  async getProductos(id: string) {
    const path = 'Usuarios/' + this.path1 + '/Mascotas/';
    console.log('uid> '+ this.path1)
    this.firestoreservice.getCollection<Producto>(id).subscribe(res => {
      console.log('producot res')
      console.log(res)
      this.productos = res;
      if (res.length == 0) {
        this.listallena = false;
      } else {

        this.listallena = true;
      }

    });
  }

  async deleteProducto(producto: Producto) {
    const uid = await this.firebaseauthService.getUid();
    const path = 'Usuarios/' + uid + '/Mascotas/';
    const alert = await this.alertController.create({
      cssClass: 'normal',
      header: 'Advertencia',
      message: ' Seguro desea <strong>eliminar</strong> este registro',
      buttons: [
        {
          text: 'cancelar',
          role: 'cancel',
          cssClass: 'normal',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
            // this.alertController.dismiss();
          }
        }, {
          text: 'Ok',
          handler: () => {
            console.log('Confirm Okay');
            this.firestoreService.deleteDoc(path, producto.id).then(res => {
              this.presentToast('eliminado con exito');
              this.alertController.dismiss();
              this.nuevo();
              this.enableNewProducto = false
            }).catch(error => {
              this.presentToast('no se pude eliminar');
            });
          }
        }
      ]
    });
    await alert.present();
  }

  nuevo() {
    this.enableNewProducto = true;
    this.newProducto = {
      nombredelamascota: '',
      tutor: '',
      fechadenacimiento: new Date(),
      especie: '',
      sexo: '',
      telefonotutor: '',
      foto: 'htt',
      id: this.firestoreService.getId(),
    };
  }

  async presentLoading() {
    this.loading = await this.loadingController.create({
      cssClass: 'normal',
      message: 'guardando...',
    });
    await this.loading.present();
  }

  async presentToast(msg: string) {
    const toast = await this.toastController.create({
      message: msg,
      cssClass: 'normal',
      duration: 2000,
      color: 'light',
    });
    toast.present();
  }

  async newImageUpload(event: any) {
    if (event.target.files && event.target.files[0]) {
      this.newFile = event.target.files[0];
      const reader = new FileReader();
      reader.onload = ((image) => {
        this.newProducto.foto = image.target?.result as string;
      });
      reader.readAsDataURL(event.target.files[0]);
    }
  }


}
