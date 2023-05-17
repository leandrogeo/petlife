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
    admin: false
  };

  suscriberUserInfo: Subscription;
  productos: Producto[] = [];
  listallena = true;
  newProducto: Producto;
  enableNewProducto = false;
  //private path = 'Mascotas/';
  newFile: any;
  loading: any;
  uid = '';
  private path1 = "";
  opcion: string;

  usuarioescogido: any;
  usuarios: Usuario[] = [];
  nomusuescogido: string;
  public results = [...this.usuarios];
  segmascotas = false;
  valor = 0
  pathguardar = ''

  constructor(
    public menuController: MenuController,
    public firebaseauthService: FirebaseauthService,
    public firestoreservice: FirestoreService,
    public firestoreService: FirestoreService,
    public loadingController: LoadingController,
    public toastController: ToastController,
    public alertController: AlertController,
    public firestorageservice: FirestorageService,
    ) {
    this.getUsuarios();
    this.firebaseauthService.stateAuth().subscribe(res => {
      if (res !== null) {
        console.log("constructor");
        this.uid = res.uid;
        this.getUserInfo(this.uid);
        this.path1 = 'Usuarios/' + this.uid + '/Mascotas/';
      } else {
        console.log(this.uid);
      }
    });
    
  }


  async ngOnInit() {
    const uid1 = await this.firebaseauthService.getUid();
    const path = 'Usuarios/' + uid1 + '/Mascotas/';
  }

  getUserInfo(uid: string) {
    const path = 'Usuarios';
    this.suscriberUserInfo = this.firestoreService.getDoc<Usuario>(path, uid).subscribe(res => {
      if (res !== undefined) {
        this.usuario = res;
      }
    });
  }

  cambio(opcion) {
    console.log(opcion)
    this.newProducto.sexo = this.opcion;
  }

  openMenu() {
    console.log('open menu');
    this.menuController.toggle('principal');
  }

  async guardarProducto() {
   
    if (this.nomusuescogido == undefined || this.nomusuescogido == '0') {
      this.pathguardar = 'Usuarios/' + this.newProducto.uidtutor + '/Mascotas/';
    } else {
      this.newProducto.tutor = this.nomusuescogido
      this.newProducto.telefonotutor = this.usuarioescogido.celular
      this.newProducto.uidtutor = this.usuarioescogido.uid
      this.pathguardar = 'Usuarios/' + this.usuarioescogido.uid + '/Mascotas/';
    }
    if(this.newProducto.nombredelamascota != ''){
      if(this.newProducto.tutor != ''){
        if(this.newProducto.especie != ''){
          this.presentLoading();
          const name = this.newProducto.nombredelamascota;
          if (this.newFile !== undefined) {
            const res = await this.firestorageservice.uploadImage(this.newFile, this.pathguardar, name);
            this.newProducto.foto = res;
          }
          this.firestoreservice.createDoc(this.newProducto, this.pathguardar, this.newProducto.id).then(res => {
            this.loading.dismiss();
            this.presentToast('Guardo con exito');
            this.nuevo();
            this.enableNewProducto = false
          }).catch(error => {
            this.presentToast('No se pude guardar');
          });
        }else{
          const alert = this.alertController.create({
            //cssClass: 'my-custom-class',
            header: 'Fallo al registra mascota',
            message: 'Por favor ingresar la rasa de la mascota',
            buttons: ['OK']
          });
    
          (await alert).present();
        }
      }else{
        const alert = this.alertController.create({
          //cssClass: 'my-custom-class',
          header: 'Fallo al registra mascota',
          message: 'Por favor escoja un tutor',
          buttons: ['OK']
        });
  
        (await alert).present();
      }

    }else{
      const alert = this.alertController.create({
        //cssClass: 'my-custom-class',
        header: 'Fallo al registra mascota',
        message: 'Por favor completar el campo "Nombre de la mascota',
        buttons: ['OK']
      });

      (await alert).present();
    }






    
  }

  //Revisra en el buscar usuarios
  async getProductos(id: string) {
    const path = 'Usuarios/' + id + '/Mascotas/';
    this.firestoreservice.getCollection<Producto>(path).subscribe(res => {
      this.productos = res;
      if (res.length == 0) {
        this.listallena = false;
      } else {
        this.listallena = true;
      }

    });
  }
  //OPTENER LISTA DE USUARIOS PARA 
  async getUsuarios() {
    const path = 'Usuarios';
    this.firestoreservice.getCollection<Usuario>(path).subscribe(res => {
      console.log('usuarios res')
      this.usuarios = res;
      console.log(res.length + this.valor)
      console.log(this.valor)
      this.results = this.usuarios
      if (res.length == 0) {
        this.listallena = false;
      } else {
        this.listallena = true;
      }
    });
  }

  async deleteProducto(producto: Producto) {
    const uid = await this.firebaseauthService.getUid();

    const path = 'Usuarios/' + producto.uidtutor + '/Mascotas/';
    console.log('path  ' + path)
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
      fechadenacimiento: '',
      especie: '',
      sexo: '',
      telefonotutor: '',
      foto: 'https://m.media-amazon.com/images/I/31GcvQDgUHL._AC_.jpg',
      uidtutor: '',
      id: this.firestoreService.getId(),
    };
    this.nomusuescogido = '0'
    this.opcion = '0'
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

  cambiousu(opcion) {
    this.usuarioescogido = this.usuarios.find(persona => persona.nombre === opcion)
    this.getProductos(this.usuarioescogido.uid);
  }

  buscar(event) {
    const buscar = event.target.value.toLowerCase();
    this.results = this.usuarios
    console.log('sdaf')
    console.log(this.results)
    if (buscar && buscar.trim() != '') {
      this.results = this.results.filter((usuarios: any) => {
        return (usuarios.nombre.toLowerCase().indexOf(buscar.toLowerCase()) > -1);

      })
    }
  }

}
