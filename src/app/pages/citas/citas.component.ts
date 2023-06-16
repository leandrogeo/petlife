import { DatePipe } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { AlertController, LoadingController, MenuController, ToastController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { Citas, Producto, Usuario, servicios } from 'src/app/models';
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
    public firestorageservice: FirestorageService,
    private datePipe: DatePipe) {

    this.firebaseauthService.stateAuth().subscribe(res => {
      if (res !== null) {
        this.uid = res.uid
        console.log()
        this.getProductos(res.uid);
      } else {
 
      }
    });

    this.getcitasgenerales()
  }
  loading: any;
  uid: string;


  productos: Producto[] = [];

  usuario: Usuario = {
    uid: '',
    correo: '',
    contrasenia: '',
    celular: '',
    direccion: '',
    nombre: '',
    admin: false,
  };
  mascotaescogido: any;
  mascota: string;
  citaagendada: any;
  Citas: Citas[] = [];
  citastotales: Citas[] = [];

  nombremasct: string;
  servicios: servicios[] = [];
  citas: Citas = {
    id_cita: this.firestoreservice.getId(),
    fecha_cita: '',
    idtutor_cita: '',
    motivo_cita: '',
    estadodelacita: 'agendado',
    id_mascotacita: '',
    foto_cita: '',
    namepet: '',
    diagnostico: '',
    receta_consul: false,
    nombreusu:'',
    correousu: '',
    cirugia_consul: false,
    hospi_consul: false,
    pesomas: '',
    observacion_cita:''
  }

  async ngOnInit() {
    this.getAcutualDate();
    this.getServicios()
  }

  today: any

  getAcutualDate() {
    const date = new Date();
    this.today = date.getFullYear() + '-' + ('0' + (date.getMonth() + 1)).slice(-2) + '-' + ('0' + date.getDate()).slice(-2);
  }

  // RESTRINGIR LOS FINDES DE SEMANA  
  isWeekday = (dateString: string) => {
    const date = new Date(dateString);
    const utcDay = date.getUTCDay();

    /**
     * Date will be enabled if it is not
     * Sunday or Saturday
     */
    return utcDay !== 0 && utcDay !== 6;
  };

  openMenu() {
    this.menucontroller.toggle('principal');
  }

  nuevo() {
    this.citas = {
      id_cita: this.firestoreservice.getId(),
      fecha_cita: '',
      idtutor_cita: '',
      motivo_cita: '',
      estadodelacita: 'agendado',
      id_mascotacita: '',
      foto_cita: '',
      namepet: '',
      diagnostico: '',
      receta_consul: false,
      nombreusu:'',
      correousu: '',
      cirugia_consul: false,
      hospi_consul: false,
      pesomas: '',
      observacion_cita:''
    }
    this.mascotaescogido = undefined
    this.mascota = '0'
  }

  async getProductos(id) {
      const path = 'Usuarios/' + id + '/Mascotas/';
      this.firestoreservice.getCollectionWithCondition<Producto>(path,'estado','==',true).subscribe(res => {
        this.productos = res;
        if (res.length == 0) {
          console.log('no hay mascota')
        }
      });


    const path1 = 'Usuarios';
    console.log('aquiii')
    try {
      this.firestoreservice.getDoc<Usuario>(path1, id).subscribe(res => {
        if (res !== undefined) {
          this.usuario = res;
          console.log(this.usuario)
        }
      });
    } catch (error) {
      console.log('ERROR ' + error)
    }
  }

  mascotaescog(mascota) {
    this.mascotaescogido = this.productos.find(persona => persona.nombredelamascota === mascota)
  }

  async setCita() {

    let copias = this.citastotales.filter(citastotales => citastotales.fecha_cita === this.citas.fecha_cita);

    if (copias.length == 0) {
      if (this.mascotaescogido != undefined) {
        if (this.citas.motivo_cita != '') {
          if (this.citas.fecha_cita != '') {
            //this.citas.nombremascota_cita=this.mascotaescogido.nombredelamascota
            // this.citas.fotomascota_cita=this.mascotaescogido.foto
            //this.citas.nombremascota='dasfas'
            this.nombremasct = this.mascotaescogido.nombredelamascota
            this.citas.namepet = this.mascotaescogido.nombredelamascota
            this.citas.foto_cita = this.mascotaescogido.foto
            this.citas.id_mascotacita = this.mascotaescogido.id
            this.citas.idtutor_cita = this.uid
            this.citas.correousu = this.usuario.correo
            this.citas.nombreusu=this.usuario.nombre
            this.citaagendada = this.citas
            this.presentLoading();
            const path = 'Usuarios/' + this.uid + '/Mascotas/' + this.mascotaescogido.id + '/Citas';
            this.firestoreservice.createDoc(this.citaagendada, path, this.citas.id_cita).then(res => {
              this.loading.dismiss();
              this.presentToast('Agendamiento exitoso');
            }).catch(error => {
              this.presentToast('No se pude agendar');
            });

            this.enviarcorreo(this.usuario.correo, this.mascotaescogido.nombredelamascota, this.usuario.nombre, this.citas.fecha_cita)
            this.nuevo()

          }
          else {
            const alert = await this.alertController.create({
              //cssClass: 'my-custom-class',
              header: 'Fallo al agendar cita',
              message: 'Por favor elija una fecha diferente  la actual',
              buttons: ['OK']
            });
            await alert.present();
          }
        } else {
          const alert = await this.alertController.create({
            //cssClass: 'my-custom-class',
            header: 'Fallo al agendar cita',
            message: 'Por favor llene el motivo de la consulta',
            buttons: ['OK']
          });
          await alert.present();
        }
      } else {
        const alert = await this.alertController.create({
          //cssClass: 'my-custom-class',
          header: 'Fallo al agendar cita',
          message: 'Por favor escoger una mascota ',
          buttons: ['OK']
        });
        await alert.present();
      }
    } else {
      const alert = await this.alertController.create({
        //cssClass: 'my-custom-class',
        header: 'Fallo al agendar cita',
        message: 'Por favor una fecha diferente, la fecha u hora escogida esta ocupada',
        buttons: ['OK']
      });
      await alert.present();
    }

  }


  getcitasgenerales() {
    const path = 'Citas';
    this.firestoreservice.getCollectionCitas<Citas>(path).subscribe(res => {
      this.citastotales = res;
    })
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
      message: 'Agendando...',
    });
    await this.loading.present();
  }

  enviarcorreo(para: string, nombremascota: string, nombretutor: string, fechacita: string) {
    const correo = {
      to: para,
      message: {
        text: 'Registro exitoso!',
        subject: 'Registro de cita para la mascota ' + nombremascota,
        html: '<html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Cita médica para tu mascota</title></head><body> <div style="max-width: 600px; margin: 0 auto;"> <img src="https://scontent.fuio35-1.fna.fbcdn.net/v/t39.30808-6/225807018_137143835221353_3574420849320651821_n.jpg?_nc_cat=101&ccb=1-7&_nc_sid=09cbfe&_nc_eui2=AeEjR56AnSqaB_r7XsFv8ZU2wp2iJA4iDuLCnaIkDiIO4qcbpuXH4tABcoyirtQZ5gXndyDQFjlVmMgxxuzbTbpE&_nc_ohc=mn_nF2zFKqQAX9duWnt&_nc_ht=scontent.fuio35-1.fna&oh=00_AfBXOSmUP2sdTtKNB1-k4LW41jY2b9N7PQ5T7zcoBJHuZw&oe=648A7F8C" alt="Logo de la clínica veterinaria" style="max-width: 200px;"> <h1>Cita médica para tu mascota</h1> <p>Estimado/a ' + nombretutor.toUpperCase() + ',</p> <p>Te informamos que agendaste una cita médica para tu mascota: ' + nombremascota.toUpperCase() + '</p><h2>Detalles de la cita:</h2><ul><li><strong>Mascota:</strong> ' + nombremascota.toUpperCase() + '</li><li><strong>Fecha:</strong>' + this.datePipe.transform(fechacita, 'dd/MM/yyyy') + '</li><li><strong>Hora:</strong>' + this.datePipe.transform(fechacita, 'HH:mm') + '</li></ul><p>Por favor, asegúrate de llegar a tiempo!</p><p>Si necesitas cancelar o reprogramar la cita, te pedimos que nos contactes lo antes posible.</p><p>¡Esperamos verte pronto en nuestra clínica veterinaria!</p><p>Atentamente,</p><p>PETLIFE</p></div></body></html>',
      }
    };
    this.firestoreservice.createDoc(correo, 'mail', this.firestoreservice.getId()).then(res => {
      console.log('correo enviado')
    }).catch(error => {
      console.log('correo no enviado')
    });
  }
  getServicios() {
    this.firestoreservice.getCollection<servicios>('Servicios').subscribe(res => {
      this.servicios = res;
      console.log(this.servicios)
    });
  }

}