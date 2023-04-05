import { Component, OnInit } from '@angular/core';
import { AlertController, LoadingController, MenuController, ToastController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { Citas, Producto, Usuario } from 'src/app/models';
import { FirebaseauthService } from 'src/app/services/firebaseauth.service';
import { FirestorageService } from 'src/app/services/firestorage.service';
import { FirestoreService } from 'src/app/services/firestore.service';


@Component({
  selector: 'app-citas',
  templateUrl: './citas.component.html',
  styleUrls: ['./citas.component.scss'],
})
export class CitasComponent implements OnInit {

  constructor(
    public menucontroller: MenuController,
    public firebaseauthService: FirebaseauthService,
    public firestoreservice: FirestoreService,
    public loadingController: LoadingController,
    public toastController: ToastController,
    public alertController: AlertController,
    public firestorageservice: FirestorageService,) {
    
    this.firebaseauthService.stateAuth().subscribe(res => {
      if (res !== null) {
        this.uid = res.uid
        this.getProductos(res.uid);
        //this.getCitasNuevos(res.uid)
       // console.log("cita")
      } else {

      }
    });


  }
  loading: any;
  uid: string;S


  productos: Producto[] = [];


  mascotaescogido: any;
  mascota: string;
  citaagendada: any;
  Citas: Citas[] = [];
  

  citas: Citas = {
    id_cita: this.firestoreservice.getId(),
    fecha_cita: '',
    idtutor_cita: '',
    motivo_cita: '', 
    estadodelacita: 'agendado',
  }

  async ngOnInit() { }

  openMenu() {
    console.log('open menu');
    this.menucontroller.toggle('principal');
  }

  nuevo() {
    this.citas = {
      id_cita: this.firestoreservice.getId(),
      fecha_cita: '',
      idtutor_cita: '', 
      motivo_cita: '',
      estadodelacita: 'agendado',
    }
    this.mascotaescogido = undefined
    this.mascota = '0'
    console.log("nuevo")
  }

  async getProductos(id) {
    const path = 'Usuarios/' + id + '/Mascotas/';
    this.firestoreservice.getCollection<Producto>(path).subscribe(res => {
      this.productos = res;
      if (res.length == 0) {
        console.log("no hay mascotas "+res)
      }
    });
  }

  mascotaescog(mascota) {
    this.mascotaescogido = this.productos.find(persona => persona.nombredelamascota === mascota)
  }

  async setCita() {
    if (this.mascotaescogido === undefined) {
      const alert = await this.alertController.create({
        //cssClass: 'my-custom-class',
        header: 'Fallo al agendar cita',
        message: 'Por favor escoger una mascota ',
        buttons: ['OK']
      });

      await alert.present();
    } else {
      this.citas.idtutor_cita=this.uid
      this.citaagendada = this.citas
      this.presentLoading();
      const path = 'Usuarios/' + this.uid + '/Mascotas/' + this.mascotaescogido.id + '/Citas';
      this.firestoreservice.createDoc(this.citaagendada, path, this.citas.id_cita).then(res => {
        this.loading.dismiss();
        this.presentToast('Guardo con exito');
      }).catch(error => {
        this.presentToast('No se pude guardar');
      });
      this.nuevo()
    }

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
