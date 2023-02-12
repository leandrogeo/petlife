import { Component, OnInit } from '@angular/core';
import { AlertController, LoadingController, MenuController, ToastController } from '@ionic/angular';
import { stringify } from 'querystring';
import { Desp, Producto } from 'src/app/models';
import { ActivatedRoute } from '@angular/router';
import { FirestoreService } from '../../services/firestore.service';
import { FirestorageService } from '../../services/firestorage.service';
import { FirebaseauthService } from '../../services/firebaseauth.service';
import { Usuario } from '../../models';
import { Subscription } from 'rxjs';
import { Console, timeStamp } from 'console';

@Component({
  selector: 'app-registros',
  templateUrl: './registros.component.html',
  styleUrls: ['./registros.component.scss'],
})
export class RegistrosComponent implements OnInit {

  opcion: string;
  segmento:string;
  mascota:string;
  productos: Producto[] = [];
  usuarioescogido:any;
  mascotaescogido:any;
  usuarios: Usuario[] = [];
  uid = '';
  id=''
  loading: any;

  desparacitacion: Desp = {
    id_des:this.firestoreService.getId(),
    fecha_des:'',
    peso_des:'',
    producto_des:'',
    proxi_des:'',
  };

  producto:any;

  constructor(
    public menucontroller: MenuController,
    public firebaseauthService: FirebaseauthService,
    public firestoreservice: FirestoreService,
    public firestoreService: FirestoreService,
    public loadingController: LoadingController,
    public toastController: ToastController,
    public alertController: AlertController,
    public firestorageservice: FirestorageService,
    private activateroute: ActivatedRoute,
  ) {
    this.getUsuarios();
  }

  ngOnInit() { }

  openMenu() {
    console.log('open menu');
    this.menucontroller.toggle('principal');
  }



  async getProductos(id: string) {
    const path = 'Usuarios/' + id + '/Mascotas/';
    this.firestoreservice.getCollection<Producto>(path).subscribe(res => {
      console.log('producot res')
      console.log(path)
      this.productos = res;
      console.log(res)
      if (res.length == 0) {
      }
    });
  }

  async getUsuarios() {
    const path = 'Usuarios';
    this.firestoreservice.getCollection<Usuario>(path).subscribe(res => {
      console.log('usuarios res')
      this.usuarios = res;
      console.log(res)
      if (res.length == 0) {
      }
    });
  }


  cambio(opcion) {
    this.usuarioescogido = this.usuarios.find(persona => persona.nombre === opcion)
    this.getProductos(this.usuarioescogido.uid);
  }

  mascotaescog(mascota){
    this.mascotaescogido = this.productos.find(persona => persona.nombredelamascota === mascota)
  }

  cancelar(){
    
    this.segmento='0'
    this.mascota='0'
    this.opcion='ninguno'
    this.productos=[];
  }



  async setDesparacitacion(){
    this.presentLoading();
    console.log('udi')
    console.log(this.usuarioescogido.uid)
    //this.newProducto.tutor = this.usuario.nombre
   // this.newProducto.telefonotutor = this.usuario.celular
   //his.desparacitacion.id_des = this.firestoreService.getId();
    const path = 'Usuarios/' + this.usuarioescogido.uid + '/Mascotas/'+this.mascotaescogido.id+'/Desparacitacion';
    //const name = this.newProducto.nombredelamascota;

    this.firestoreservice.createDoc(this.desparacitacion, path, this.desparacitacion.id_des).then(res => {
      this.loading.dismiss();
      this.presentToast('Guardo con exito');
      //this.nuevo();
      //this.enableNewProducto = false
    }).catch(error => {
      this.presentToast('No se pude guardar');
    });
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
  async presentLoading() {
    this.loading = await this.loadingController.create({
      cssClass: 'normal',
      message: 'guardando...',
    });
    await this.loading.present();
  }
}
