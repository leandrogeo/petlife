import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, LoadingController, MenuController, ToastController } from '@ionic/angular';
import { computeStackId } from '@ionic/angular/directives/navigation/stack-utils';
import { Citas, Hospi, Receta } from 'src/app/models';
import { FirestoreService } from 'src/app/services/firestore.service';

@Component({
  selector: 'app-modificarcita',
  templateUrl: './modificarcita.component.html',
  styleUrls: ['./modificarcita.component.scss'],
})
export class ModificarcitaComponent implements OnInit {
  fechaactual: any;
  valorciru = false
  valorhospi = false

  hospi: Hospi = {
    id_hospi: '',
    fecha_hospi: Date(),
    motivo_hospi: '',
    medico_hospi: '',
  }
  hospita: Hospi[] = []

  receta: Receta = {
    id_receta: '',
    medicamento_receta: '',
    indicaciones_receta: '',
  }
  recetas: Receta[] = []


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
  id_cita: string;
  constructor(
    private router: Router,
    public menucontroller: MenuController,
    public firestoreservice: FirestoreService,
    public loadingController: LoadingController,
    public toastController: ToastController,
    public alertController: AlertController,
    private activateroute: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.id_cita = this.activateroute.snapshot.paramMap.get('id_cita')
    this.getCitasAtendidas(this.id_cita)
    console.log(this.valorciru)
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
          this.citas.hospi_consul = this.valorhospi
          this.citas.receta_consul = this.valorciru
          const path = 'Usuarios/' + this.citas.idtutor_cita + '/Mascotas/' + this.citas.id_mascotacita + '/Citas';
          //GUARDA LA CITA
          this.firestoreservice.createDoc(this.citas, path, this.citas.id_cita).then(res => {
            this.loading.dismiss();
            //this.presentToast('Guardo con exito cita');
            // this.router.navigate(['/citasge']);
          }).catch(error => {
            this.presentToast('No se pude guardar general');
            console.log(error)
          });
          //GUARDA LA Hospitalizacion'
          if (this.citas.hospi_consul === true) {
            if (this.hospi.medico_hospi != '') {
              console.log(this.hospi.motivo_hospi)
              if (this.hospi.motivo_hospi != '') {
                const pathhospi = 'Usuarios/' + this.citas.idtutor_cita + '/Mascotas/' + this.citas.id_mascotacita + '/Citas/' + this.citas.id_cita + '/Hospitalizacion';
                this.hospi.id_hospi = this.citas.id_cita
                this.firestoreservice.createDoc(this.hospi, pathhospi, this.citas.id_cita).then(res => {
                  this.loading.dismiss();
                  this.router.navigate(['/citasge']);
                  this.presentToast('Guardo con exito cita');
                }).catch(error => {
                  this.presentToast('No se pude guardar hospi');
                });
              } else {
                const alert = await this.alertController.create({
                  //cssClass: 'my-custom-class',
                  header: 'Fallo al guardar',
                  message: 'El campo MOTIVO DE LA HOSPITALIZACION, esta vacio',
                  buttons: ['OK']
                });
                await alert.present();
              }
            } else {
              const alert = await this.alertController.create({
                //cssClass: 'my-custom-class',
                header: 'Fallo al guardar',
                message: 'El campo MEDICO TRATANTE, esta vacio',
                buttons: ['OK']
              });
              await alert.present();
            }
          }

          //GUARDA LA RECETA
          if (this.citas.receta_consul === true) {
            if (this.receta.indicaciones_receta != '') {
              if(this.receta.medicamento_receta != ''){
                const pathreceta = 'Usuarios/' + this.citas.idtutor_cita + '/Mascotas/' + this.citas.id_mascotacita + '/Citas/' + this.citas.id_cita + '/Recetas';
                this.receta.id_receta = this.citas.id_cita
                this.firestoreservice.createDoc(this.receta, pathreceta, this.citas.id_cita).then(res => {
                  //this.presentToast('Guardo con exito hospi ');
                  this.router.navigate(['/citasge']);
                }).catch(error => {
                  this.presentToast('No se pude guardar receta');
                });
              }else {
              const alert = await this.alertController.create({
                //cssClass: 'my-custom-class',
                header: 'Fallo al guardar',
                message: 'El campo MEDICAMENTO, esta vacio',
                buttons: ['OK']
              });
              await alert.present();
            }
            }else {
              const alert = await this.alertController.create({
                //cssClass: 'my-custom-class',
                header: 'Fallo al guardar',
                message: 'El campo INDICACIONES, esta vacio',
                buttons: ['OK']
              });
              await alert.present();
            }
          }

          //
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
    await this.firestoreservice.getCollectionAll2<Citas>(path, 'id_cita', '==', id).subscribe(res => {
      if (res.length) {
        this.cita = res
        this.citas = this.cita[0]
      }
    });

    console.log(id)
    const pathhospi = 'Hospitalizacion';
    await this.firestoreservice.getCollectionAllHospi<Hospi>(pathhospi, 'id_hospi', '==', id).subscribe(res => {
      console.log(res)
      if (res.length) {
        this.hospita = res
        this.hospi = this.hospita[0]
      }
    });


    await this.firestoreservice.getCollectionAllHospi<Receta>('Recetas', 'id_receta', '==', id).subscribe(res => {
      console.log(res)
      if (res.length) {
        this.recetas = res
        this.receta = this.recetas[0]
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


  cambiociru() {
    console.log(this.valorciru)
    this.valorciru = !this.valorciru
    console.log(this.valorciru)
  }
  cambiohospi() {
    console.log(this.valorciru)
    this.valorhospi = !this.valorhospi
    console.log(this.valorciru)
  }

}
