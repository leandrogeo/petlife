import { Component, OnInit } from '@angular/core';
import { AlertController, LoadingController, MenuController, ToastController } from '@ionic/angular';
import { Citas, Desp, Hospi, Producto, Receta, Vacunas, servicios } from 'src/app/models';
import { FirestoreService } from '../../services/firestore.service';
import { Usuario } from '../../models';
import { DatePipe } from '@angular/common';
import { computeStackId } from '@ionic/angular/directives/navigation/stack-utils';

@Component({
  selector: 'app-registros',
  templateUrl: './registros.component.html',
  styleUrls: ['./registros.component.scss'],
})
export class RegistrosComponent implements OnInit {

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
  servicios: servicios[] = [];
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
    nombreusu: '',
    correousu: '',
    cirugia_consul: false,
    hospi_consul: false,
    pesomas: '',
    observacion_cita: ''
  }


  fechaComoCadena: string;

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
    this.getcitasgenerales();
    this.getServicios()
  }

  ngOnInit() {
    const fecha = new Date();
    this.fechaComoCadena = fecha.toISOString();
    this.getAcutualDate()
  }

  openMenu() {
    this.menucontroller.toggle('principal');
  }

  cambiarfecha(fecha) {
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
    let copias = this.citastotales.filter(citastotales => citastotales.fecha_cita === this.desparacitacion.proxi_des);

    if (copias.length === 0) {
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
            this.citas.fecha_cita = this.desparacitacion.proxi_des,
              this.citas.idtutor_cita = this.usuarioescogido.uid,
              this.citas.motivo_cita = 'Desparacitacion $10-15',
              this.citas.estadodelacita = 'agendado',
              this.citas.id_mascotacita = this.mascotaescogido.id,
              this.citas.foto_cita = this.mascotaescogido.foto,
              this.citas.namepet = this.mascotaescogido.nombredelamascota,
              this.citas.diagnostico = '',
              this.citas.receta_consul = false,
              this.citas.nombreusu = this.usuarioescogido.nombre,
              this.citas.correousu = this.usuarioescogido.correo,
              this.citas.cirugia_consul = false,
              this.citas.hospi_consul = false,
              this.citas.pesomas = ''



            console.log(this.citas)

            const pathcita = 'Usuarios/' + this.usuarioescogido.uid + '/Mascotas/' + this.mascotaescogido.id + '/Citas';
            this.firestoreservice.createDoc(this.citas, pathcita, this.citas.id_cita).then(res => {
              this.loading.dismiss();
              this.presentToast('Agendamiento exitoso');
            }).catch(error => {
              this.presentToast('No se pude agendar');
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

    } else {
      const alert = await this.alertController.create({
        //cssClass: 'my-custom-class',
        header: 'Fallo al agendar proxima desparacitacion',
        message: 'Por favor elija una fecha diferente, la fecha u hora escogida esta ocupada',
        buttons: ['OK']
      });
      await alert.present();

    }



  }

  async setvac() {
    let copias = this.citastotales.filter(citastotales => citastotales.fecha_cita === this.vacunacion.proxi_vac);

    if (copias.length === 0) {
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
            this.citas.fecha_cita = this.vacunacion.proxi_vac,
              this.citas.idtutor_cita = this.usuarioescogido.uid,
              this.citas.motivo_cita = 'Vacuna $10-15',
              this.citas.estadodelacita = 'agendado',
              this.citas.id_mascotacita = this.mascotaescogido.id,
              this.citas.foto_cita = this.mascotaescogido.foto,
              this.citas.namepet = this.mascotaescogido.nombredelamascota,
              this.citas.diagnostico = '',
              this.citas.receta_consul = false,
              this.citas.nombreusu = this.usuarioescogido.nombre,
              this.citas.correousu = this.usuarioescogido.correo,
              this.citas.cirugia_consul = false,
              this.citas.hospi_consul = false,
              this.citas.pesomas = ''
            console.log(this.citas)
            const pathcita = 'Usuarios/' + this.usuarioescogido.uid + '/Mascotas/' + this.mascotaescogido.id + '/Citas';
            this.firestoreservice.createDoc(this.citas, pathcita, this.citas.id_cita).then(res => {
              this.loading.dismiss();
              this.presentToast('Agendamiento exitoso');
            }).catch(error => {
              this.presentToast('No se pude agendar');
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

  async setconsul() {
    if (this.citas.pesomas != '') {
      if (this.citas.diagnostico != '') {
        if (this.citas.motivo_cita != '') {
          this.presentLoading();
          this.citas.fecha_cita = this.fechaComoCadena
          this.citas.foto_cita = this.mascotaescogido.foto
          this.citas.id_mascotacita = this.mascotaescogido.id
          this.citas.idtutor_cita = this.usuarioescogido.uid
          this.citas.namepet = this.mascotaescogido.nombredelamascota
          this.citas.hospi_consul = this.valorhospi
          this.citas.receta_consul = this.valorciru
          const path = 'Usuarios/' + this.usuarioescogido.uid + '/Mascotas/' + this.mascotaescogido.id + '/Citas';
          this.firestoreservice.createDoc(this.citas, path, this.citas.id_cita).then(res => {
            this.loading.dismiss();
            // this.presentToast('Guardo con exito');
          }).catch(error => {
            this.presentToast('No se pude guardar');
          });
          //GUARDA LA Hospitalizacion'
          console.log(this.citas.hospi_consul)
          if (this.citas.hospi_consul === true) {
            if (this.hospi.medico_hospi != '') {
              console.log(this.hospi.motivo_hospi)
              if (this.hospi.motivo_hospi != '') {
                const pathhospi = 'Usuarios/' + this.citas.idtutor_cita + '/Mascotas/' + this.citas.id_mascotacita + '/Citas/' + this.citas.id_cita + '/Hospitalizacion';
                this.hospi.id_hospi = this.citas.id_cita
                this.firestoreservice.createDoc(this.hospi, pathhospi, this.citas.id_cita).then(res => {
                  this.loading.dismiss();
                  this.presentToast('Guardo con exito cita');
                }).catch(error => {
                  this.presentToast('No se pude guardar hospi');
                });

                this.nuevo()
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
          } else {
            console.log('hospi no es true')
          }

          //GUARDA LA RECETA
          if (this.citas.receta_consul === true) {
            if (this.receta.indicaciones_receta != '') {
              if (this.receta.medicamento_receta != '') {
                const pathreceta = 'Usuarios/' + this.citas.idtutor_cita + '/Mascotas/' + this.citas.id_mascotacita + '/Citas/' + this.citas.id_cita + '/Recetas';
                this.receta.id_receta = this.citas.id_cita
                this.firestoreservice.createDoc(this.receta, pathreceta, this.citas.id_cita).then(res => {
                  //this.presentToast('Guardo con exito hospi ');

                }).catch(error => {
                  this.presentToast('No se pude guardar receta');
                });
                this.nuevo()
              } else {
                const alert = await this.alertController.create({
                  //cssClass: 'my-custom-class',
                  header: 'Fallo al guardar',
                  message: 'El campo MEDICAMENTO, esta vacio',
                  buttons: ['OK']
                });
                await alert.present();
              }
            } else {
              const alert = await this.alertController.create({
                //cssClass: 'my-custom-class',
                header: 'Fallo al guardar',
                message: 'El campo INDICACIONES, esta vacio',
                buttons: ['OK']
              });
              await alert.present();
            }
          }

          //this.nuevo()
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
      nombreusu: '',
      correousu: '',
      cirugia_consul: false,
      hospi_consul: false,
      pesomas: '',
      observacion_cita: ''
    }

    this.cancelar()

  }

  getServicios() {
    this.firestoreservice.getCollection<servicios>('Servicios').subscribe(res => {
      this.servicios = res;
      console.log(this.servicios)
    });
  }





  cambiociru() {
    console.log(this.valorciru)
    this.valorciru = !this.valorciru
    console.log(this.valorciru)
  }

  cambiohospi() {
    console.log(this.valorhospi)
    this.valorhospi = !this.valorhospi
    console.log(this.valorhospi)
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

  today: any
  getAcutualDate() {
    const date = new Date();
    this.today = date.getFullYear() + '-' + ('0' + (date.getMonth() + 1)).slice(-2) + '-' + ('0' + date.getDate()).slice(-2);
  }

  citastotales: Citas[] = [];
  getcitasgenerales() {
    const path = 'Citas';
    this.firestoreservice.getCollectionCitas<Citas>(path).subscribe(res => {
      this.citastotales = res;
    })
  }

}
