import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, LoadingController, MenuController, ToastController } from '@ionic/angular';
import { Citas } from 'src/app/models';
import { FirebaseauthService } from 'src/app/services/firebaseauth.service';
import { FirestorageService } from 'src/app/services/firestorage.service';
import { FirestoreService } from 'src/app/services/firestore.service';

@Component({
  selector: 'app-modificarcita',
  templateUrl: './modificarcita.component.html',
  styleUrls: ['./modificarcita.component.scss'],
})
export class ModificarcitaComponent  implements OnInit {


  citas: Citas = {
    id_cita: this.firestoreservice.getId(),
    fecha_cita: Date(),
    idtutor_cita: '',
    motivo_cita: '',
    estadodelacita: 'atendido',
    id_mascotacita: '',
    foto_cita: '',
    namepet: '',
    diagnostico: '',
    receta_consul: false,
    examenen_consul: false,
    imagen_consul: false,
    cirugia_consul: false,
    hospi_consul: false,
    pesomas: '',
  }
  loading: any;
  usuarioescogido: any;
  mascotaescogido: any;

  cita: Citas[] = []
  id_cita:string;
  constructor(
    private router: Router,
    public menucontroller: MenuController,
    public firebaseauthService: FirebaseauthService,
    public firestoreservice: FirestoreService,
    public loadingController: LoadingController,
    public toastController: ToastController,
    public alertController: AlertController,
    public firestorageservice: FirestorageService, 
    private activateroute: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.id_cita=this.activateroute.snapshot.paramMap.get('id_cita')
    this.getCitasAtendidas(this.id_cita)
  }

  openMenu() {
    this.menucontroller.toggle('principal');
  }

  async setconsul() {
    if (this.citas.pesomas != '') {
      if (this.citas.diagnostico != '') {
        if (this.citas.motivo_cita != '') {
          
          this.presentLoading();
          this.citas.estadodelacita = 'atendido'
          const path = 'Usuarios/' + this.citas.idtutor_cita + '/Mascotas/' + this.citas.id_mascotacita + '/Citas';
          this.firestoreservice.createDoc(this.citas, path, this.citas.id_cita).then(res => {
            this.loading.dismiss();
            this.presentToast('Guardo con exito');
            this.router.navigate(['/citasge']);
          }).catch(error => {
            this.presentToast('No se pude guardar');
          });
          this.nuevo()
        } else {
          const alert = await this.alertController.create({
            //cssClass: 'my-custom-class',
            header: 'Fallo al guardar',
            message: 'El campo MOTIVO, esta vacio',
            buttons: ['OK']
          });
          await alert.present();
        }

      } else {
        const alert = await this.alertController.create({
          //cssClass: 'my-custom-class',
          header: 'Fallo al guardar',
          message: 'El campo DIAGNOSTICO, esta vacio',
          buttons: ['OK']
        });
        await alert.present();
      }

    } else {
      const alert = await this.alertController.create({
        //cssClass: 'my-custom-class',
        header: 'Fallo al guardar',
        message: 'El campo PESO, esta vacio',
        buttons: ['OK']
      });
      await alert.present();
    }
  }

  async getCitasAtendidas(id) {
    const path = 'Citas';
    this.firestoreservice.getCollectionAll2<Citas>(path, 'id_cita', '==', id).subscribe(res => {
      if (res.length) {
        this.cita= res
        this.citas=this.cita[0]
      } 
    });
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

  nuevo() {
    this.citas = {
      id_cita: this.firestoreservice.getId(),
      fecha_cita: '',
      idtutor_cita: '',
      motivo_cita: '',
      estadodelacita: 'atendido',
      id_mascotacita: '',
      foto_cita: '',
      namepet: '',
      diagnostico: '',
      receta_consul: false,
      examenen_consul: false,
      imagen_consul: false,
      cirugia_consul: false,
      hospi_consul: false,
      pesomas: ''

    }
  }

}
