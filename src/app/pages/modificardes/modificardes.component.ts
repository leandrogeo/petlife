import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, LoadingController, MenuController, ToastController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { Citas, Desp, Usuario, Vacunas } from 'src/app/models';
import { FirestoreService } from 'src/app/services/firestore.service';

@Component({
  selector: 'app-modificardes',
  templateUrl: './modificardes.component.html',
  styleUrls: ['./modificardes.component.scss'],
})
export class ModificardesComponent  implements OnInit {

  id_cita: string 
  constructor(public menucontroller: MenuController,
    public firestoreservice: FirestoreService,
    public firestoreService: FirestoreService,
    public loadingController: LoadingController,
    public toastController: ToastController,
    public alertController: AlertController,
    private activateroute: ActivatedRoute,
    private router: Router) { }
  ngOnInit() {
    this.id_cita = this.activateroute.snapshot.paramMap.get('id_cita')
    this.getCitasAtendidas(this.id_cita)
    this.getcitasgenerales()
  }
  cita: Citas[] = []
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
    nombreusu: '',
    correousu: '',
    cirugia_consul: false,
    hospi_consul: false,
    pesomas: '',
    observacion_cita: ''
  }
  async getCitasAtendidas(id) {
    const path = 'Citas';
    await this.firestoreservice.getCollectionAll2<Citas>(path, 'id_cita', '==', id).subscribe(res => {
      if (res.length) {
        this.cita = res
        this.citas = this.cita[0]
      }
    });
  }
  desp: Desp = {
    id_des:  this.firestoreService.getId(),
    fecha_des: Date(),
    peso_des: '',
    producto_des: '',
    proxi_des:'',
  }
  citastotales: Citas[] = [];
  getcitasgenerales() {
    const path = 'Citas';
    this.firestoreservice.getCollectionCitas<Citas>(path).subscribe(res => {
      this.citastotales = res;
    })
  }
  async setvac() {
    let copias = this.citastotales.filter(citastotales => citastotales.fecha_cita === this.desp.proxi_des);
    if (copias.length === 0) {
      if (this.desp.proxi_des != '') {
        if (this.desp.peso_des != '') {
          if (this.desp.producto_des != '') {
            console.log(this.citas)
            this.presentLoading();
            const path = 'Usuarios/' + this.citas.idtutor_cita + '/Mascotas/' + this.citas.id_mascotacita + '/Desparacitacion';
            this.firestoreservice.createDoc(this.desp, path, this.desp.id_des).then(res => {
              this.loading.dismiss();
              this.presentToast('Guardo con exito');
            }).catch(error => {
              this.presentToast('No se pude guardar');
            });
            this.id_cita = this.firestoreservice.getId(),
            this.citas.fecha_cita = this.desp.proxi_des;
            const pathcita = 'Usuarios/' + this.citas.idtutor_cita + '/Mascotas/' + this.citas.id_mascotacita + '/Citas';
            this.firestoreservice.createDoc(this.citas, pathcita, this.citas.id_cita).then(res => {
              this.loading.dismiss();
              this.presentToast('Agendamiento exitoso');
            }).catch(error => {
              this.presentToast('No se pude agendar');
            });
            this.router.navigate(['/citasge']);
            // this.nuevo()
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
    else {
      const alert = await this.alertController.create({
        //cssClass: 'my-custom-class',
        header: 'Fallo al agendar proxima desparacitacion',
        message: 'Por favor elija una fecha diferente, la fecha u hora escogida esta ocupada',
        buttons: ['OK']
      });
      await alert.present();
    }
  }
  usuario: Usuario = {
    uid: '',
    correo: '',
    contrasenia: '',
    celular: '',
    direccion: '',
    nombre: '',
    admin: false,
  };
  suscriberUserInfo: Subscription;
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
      console.log('ERROR ' + error)
    }
  }
  today: any
  getAcutualDate() {
    const date = new Date();
    this.today = date.getFullYear() + '-' + ('0' + (date.getMonth() + 1)).slice(-2) + '-' + ('0' + date.getDate()).slice(-2);
  }
  loading: any;
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
  isWeekday = (dateString: string) => {
    const date = new Date(dateString);
    const utcDay = date.getUTCDay();
    /**
     * Date will be enabled if it is not
     * Sunday or Saturday
     */
    return utcDay !== 0 && utcDay !== 6;
  };

} 