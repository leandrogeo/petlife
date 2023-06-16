import { Component, OnInit } from '@angular/core';
import { AlertController, LoadingController, MenuController, ToastController } from '@ionic/angular';
import { Producto } from 'src/app/models';
import { FirestoreService } from '../../services/firestore.service';
import { FirestorageService } from '../../services/firestorage.service';
import { FirebaseauthService } from '../../services/firebaseauth.service';
import { Usuario } from '../../models';
import { Subscription } from 'rxjs';
import { DatePipe } from '@angular/common';
import { SetRegistroComponent } from '../../backend/set-registro/set-registro.component';


@Component({
  selector: 'app-registromascotausu',
  templateUrl: './registromascotausu.component.html',
  styleUrls: ['./registromascotausu.component.scss'],
})
export class RegistromascotausuComponent  implements OnInit {


  abierto: any;
  usuario: Usuario = {
    uid: '',
    correo: '',
    contrasenia: '',
    celular: '',
    direccion: '',
    nombre: '',
    admin: false,
  };

  idaccording: string
  suscriberUserInfo: Subscription;
  productos: Producto[] = [];
  listallena = true;
  newProducto: Producto;
  enableNewProducto = false;
  //private path = 'Mascotas/';
  newFile: any;
  loading: HTMLIonLoadingElement;
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
    private datePipe: DatePipe
  ) {
    this.getUsuarios();
    this.firebaseauthService.stateAuth().subscribe(res => {
      if (res !== null) {
        this.uid = res.uid;
        this.getUserInfo(this.uid);
        this.getProductos(this.uid)
      }
    });

  }


  async ngOnInit() {
    this.getAcutualDate();
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
    this.newProducto.sexo = this.opcion;
    console.log(this.idaccording)
  }

  openMenu() {
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
    if (this.newProducto.nombredelamascota != '') {
      if (this.newProducto.tutor != '') {
        if (this.newProducto.especie != '') {
          this.presentLoading();
          const name = this.newProducto.nombredelamascota;
          if (this.newFile !== undefined) {
            const res = await this.firestorageservice.uploadImage(this.newFile, this.pathguardar, name);
            this.newProducto.foto = res;
          }
          console.log('producto')
          console.log(this.newProducto)
          console.log('usuari ', this.usuario)
          this.enviarcorreo(this.newProducto.nombredelamascota,this.usuario.nombre,this.newProducto.fechadenacimiento,this.newProducto.especie,this.newProducto.sexo)
          this.firestoreservice.createDoc(this.newProducto, this.pathguardar, this.newProducto.id).then(res => {
            this.nuevo();
            this.enableNewProducto = false
            console.log(this.loading)
            this.loading.dismiss();
            this.presentToast('Su solicitud de nueva mascota a sido enviada');
          }).catch(error => {
            this.presentToast('No se pude guardar');
          });
        } else {
          const alert = this.alertController.create({
            //cssClass: 'my-custom-class',
            header: 'Fallo al registra mascota',
            message: 'Por favor ingresar la rasa de la mascota',
            buttons: ['OK']
          });

          (await alert).present();
        }
      } else {
        const alert = this.alertController.create({
          //cssClass: 'my-custom-class',
          header: 'Fallo al registra mascota',
          message: 'Por favor escoja un tutor',
          buttons: ['OK']
        });

        (await alert).present();
      }

    } else {
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
      this.firestoreservice.getCollectionWithCondition<Producto>(path,'estado','==',true).subscribe(res => {
        this.productos = res;
        if (res.length == 0) {
          this.listallena = false;
        } else {
          this.listallena = true;
        }
      });
  }

  //OPTENER LISTA DE USUARIOS PARA mostrara abajo
  async getUsuarios() {
    const path = 'Usuarios';
    this.firestoreservice.getCollection<Usuario>(path).subscribe(res => {
      this.usuarios = res;
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
            // this.alertController.dismiss();
          }
        }, {
          text: 'Ok',
          handler: () => {
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
      tutor: this.usuario.nombre,
      fechadenacimiento: '',
      especie: '',
      sexo: '',
      telefonotutor: '',
      foto: 'https://m.media-amazon.com/images/I/31GcvQDgUHL._AC_.jpg',
      uidtutor: this.usuario.uid,
      id: this.firestoreService.getId(),
      estado:'solicitud'
    };
    this.nomusuescogido = '0'
    this.opcion = '0'
  }
 
  async presentLoading() {
    this.loading = await this.loadingController.create({
      message: 'Cargando datos...', // Mensaje que se muestra durante la carga
      spinner: 'crescent', // Tipo de spinner de carga
      translucent: true, // Hace que el fondo sea semi-transparente
      backdropDismiss: true
    });
    return this.loading.present();
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
    //this.getProductos(this.usuarioescogido.uid);
  }

  buscar(event) {
    const buscar = event.target.value.toLowerCase();
    this.results = this.usuarios
    if (buscar && buscar.trim() != '') {
      this.results = this.results.filter((usuarios: any) => {
        return (usuarios.nombre.toLowerCase().indexOf(buscar.toLowerCase()) > -1);

      })
    }
  }

 enviarcorreo(nombremascota: string, nombretutor: string, fechacita: string,especie:string,sexo:string) {
    const correo = {
      to: 'petlifepuyo@gmail.com',
      message: {
        text: 'Registro de nueva mascota de '+nombretutor.toUpperCase()+'!' ,
        subject: 'Registro de nueva mascota de '+nombretutor.toUpperCase()+'!',
        html: '<html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Registro de nueva mascota</title></head><body> <div style="max-width: 600px; margin: 0 auto;"><img src="https://scontent.fuio35-1.fna.fbcdn.net/v/t39.30808-6/225807018_137143835221353_3574420849320651821_n.jpg?_nc_cat=101&ccb=1-7&_nc_sid=09cbfe&_nc_eui2=AeEjR56AnSqaB_r7XsFv8ZU2wp2iJA4iDuLCnaIkDiIO4qcbpuXH4tABcoyirtQZ5gXndyDQFjlVmMgxxuzbTbpE&_nc_ohc=mn_nF2zFKqQAX9duWnt&_nc_ht=scontent.fuio35-1.fna&oh=00_AfBXOSmUP2sdTtKNB1-k4LW41jY2b9N7PQ5T7zcoBJHuZw&oe=648A7F8C" alt="Logo de la clínica veterinaria" style="max-width: 200px;"> <h1>Registro de nueva mascota</h1> <p>Estimado/a Administrador</p> <p>Le solicitamos la aprobacion de la mascota: ' + nombremascota.toUpperCase() +', perteneciente al usuario: '+nombretutor +'</p><h2>Detalles de la mascota:</h2><ul><li><strong>Nombre: </strong> ' + nombremascota.toUpperCase() + '</li><li><strong>Fecha de nacimiento:</strong>' + this.datePipe.transform(fechacita, 'dd/MM/yyyy') + '</li><li><strong>Especie: </strong>' + especie + '</li><li><strong>Sexo: </strong>' + sexo + '</li></ul></div></body></html>',
      }
    };
    this.firestoreservice.createDoc(correo, 'mail', this.firestoreservice.getId()).then(res => {
      console.log('correo enviado')
    }).catch(error => {
      console.log('correo no enviado')
    });
  }
  today: any

  getAcutualDate() {
    const date = new Date();
    this.today = date.getFullYear() + '-' + ('0' + (date.getMonth() + 1)).slice(-2) + '-' + ('0' + date.getDate()).slice(-2);
  }
}
