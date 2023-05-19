import { Component, OnInit } from '@angular/core';
import { AlertController, LoadingController, MenuController, ToastController } from '@ionic/angular';
import { stringify } from 'querystring';
import { Citas, Desp, Producto, Vacunas } from 'src/app/models';
import { ActivatedRoute } from '@angular/router';
import { FirestoreService } from '../../services/firestore.service';
import { FirestorageService } from '../../services/firestorage.service';
import { FirebaseauthService } from '../../services/firebaseauth.service';
import { Usuario } from '../../models';
import { Subscription } from 'rxjs';
import { Console, timeStamp } from 'console';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-registros',
  templateUrl: './registros.component.html',
  styleUrls: ['./registros.component.scss'],
})
export class RegistrosComponent implements OnInit {

  opcion: string;
  segmento: string;
  mascota: string;
  productos: Producto[] = [];
  usuarioescogido: any;
  mascotaescogido: any;
  usuarios: Usuario[] = [];
  uid = '';
  id = ''
  loading: any;

  general: any;
  generalid: any;


  fechaactual: any;

  desparacitacion: Desp = {
    id_des: this.firestoreService.getId(),
    fecha_des: Date(),
    peso_des: '',
    producto_des: '',
    proxi_des: '',
  };

  vacunacion: Vacunas = {
    id_vac: this.firestoreService.getId(),
    fecha_vac: Date(),
    peso_vac: '',
    vacunas: '',
    proxi_vac: '',
  }

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


  fechaComoCadena:string;

  fechaproxi: Date;
  producto: any;
  pathextra: string;

  constructor(
    public menucontroller: MenuController,
    public firestoreservice: FirestoreService,
    public firestoreService: FirestoreService,
    public loadingController: LoadingController,
    public toastController: ToastController,
    public alertController: AlertController,
  ) {
    this.getUsuarios();
  }

  ngOnInit() {
    const fecha = new Date();
     this.fechaComoCadena = fecha.toISOString();
  }

  openMenu() {
    this.menucontroller.toggle('principal');
  }

  cambiarfecha(fecha){
    const datePipe = new DatePipe('en-US');
    let fechaFormateada = datePipe.transform(fecha, 'dd/MM/yyyy');

    return fechaFormateada
  }


  async getProductos(id: string) {
    const path = 'Usuarios/' + id + '/Mascotas/';
    this.firestoreservice.getCollection<Producto>(path).subscribe(res => {
      this.productos = res;
      if (res.length == 0) {
        console.log('no hay mascota')
      }
    });
  }

  async getUsuarios() {
    const path = 'Usuarios';
    this.firestoreservice.getCollection<Usuario>(path).subscribe(res => {
      this.usuarios = res;
      if (res.length == 0) {
      }
    });
  }


  cambio(opcion) {
    this.usuarioescogido = this.usuarios.find(persona => persona.nombre === opcion)
    this.getProductos(this.usuarioescogido.uid);
  }

  mascotaescog(mascota) {
    this.mascotaescogido = this.productos.find(persona => persona.nombredelamascota === mascota)
  }

  cancelar() {

    this.segmento = '0'
    this.mascota = '0'
    this.opcion = 'ninguno'
    this.productos = [];
  }



  async setdes() {
    if (this.desparacitacion.proxi_des != '') {
      if (this.desparacitacion.peso_des != '') {
        if (this.desparacitacion.producto_des != '') {
          this.presentLoading();
          const path = 'Usuarios/' + this.usuarioescogido.uid + '/Mascotas/' + this.mascotaescogido.id + '/Desparacitacion';
          this.firestoreservice.createDoc(this.desparacitacion, path, this.desparacitacion.id_des).then(res => {
            this.loading.dismiss();
            this.presentToast('Guardo con exito');
          }).catch(error => {
            this.presentToast('No se pude guardar');
          });
          this.nuevo()

        } else {
          const alert = await this.alertController.create({
            //cssClass: 'my-custom-class',
            header: 'Fallo al guardar',
            message: 'Ingrese los productos administrados a la mascota',
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

    } else {
      const alert = await this.alertController.create({
        //cssClass: 'my-custom-class',
        header: 'Fallo al guardar',
        message: 'Por favor elija una fecha diferente para la proxima desparacitacion',
        buttons: ['OK']
      });
      await alert.present();
    }
  }

  async setvac() {

    if (this.vacunacion.proxi_vac != '') {
      if (this.vacunacion.peso_vac != '') {
        if (this.vacunacion.vacunas != '') {
          this.presentLoading();
          const path = 'Usuarios/' + this.usuarioescogido.uid + '/Mascotas/' + this.mascotaescogido.id + '/Vacunacion';
          this.firestoreservice.createDoc(this.vacunacion, path, this.vacunacion.id_vac).then(res => {
            this.loading.dismiss();
            this.presentToast('Guardo con exito');
          }).catch(error => {
            this.presentToast('No se pude guardar');
          });
          this.nuevo()

        } else {
          const alert = await this.alertController.create({
            //cssClass: 'my-custom-class',
            header: 'Fallo al guardar',
            message: 'Ingrese las vacunas administrados a la mascota',
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

    } else {
      const alert = await this.alertController.create({
        //cssClass: 'my-custom-class',
        header: 'Fallo al guardar',
        message: 'Por favor elija una fecha diferente para la proxima vacuna',
        buttons: ['OK']
      });
      await alert.present();
    }










  }

  async setconsul() {
    if (this.citas.pesomas != '') {
      if (this.citas.diagnostico != '') {
        if (this.citas.motivo_cita != '') {

          this.presentLoading();
          this.citas.fecha_cita=this.fechaComoCadena
          this.citas.foto_cita = this.mascotaescogido.foto
          this.citas.id_mascotacita = this.mascotaescogido.id
          this.citas.idtutor_cita = this.usuarioescogido.uid
          this.citas.namepet = this.mascotaescogido.nombredelamascota
          const path = 'Usuarios/' + this.usuarioescogido.uid + '/Mascotas/' + this.mascotaescogido.id + '/Citas';
          this.firestoreservice.createDoc(this.citas, path, this.citas.id_cita).then(res => {
            this.loading.dismiss();
            this.presentToast('Guardo con exito');
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


  nuevo() {
    this.vacunacion = {
      id_vac: this.firestoreService.getId(),
      fecha_vac: Date(),
      peso_vac: '',
      vacunas: '',
      proxi_vac: '',
    }

    this.desparacitacion = {
      id_des: this.firestoreService.getId(),
      fecha_des: Date(),
      peso_des: '',
      producto_des: '',
      proxi_des: '',
    }


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

    this.cancelar()

  }
}
