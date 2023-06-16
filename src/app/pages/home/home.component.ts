import { Component, OnInit } from '@angular/core';
import { AlertController, AlertInput, LoadingController, MenuController, ToastController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { AppComponent } from 'src/app/app.component';
import { Comentarios, Usuario } from 'src/app/models';
import { FirestoreService } from 'src/app/services/firestore.service';

declare var google;
interface Marker {
  position: {
    lat: number,
    lng: number,
  };
  title: string;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {

  comentario: Comentarios = {
    id: this.firestoreservice.getId(),
    comentario: '',
    estado: 'solicitud',
    usuario: '',
    uidusu:''
  };


  constructor(public menucontroller: MenuController,
    public firestoreservice: FirestoreService,
    public appcomponent: AppComponent, public alertController: AlertController,
    public loadingController: LoadingController,
    public toastController: ToastController,
  ) {
    this.getComentarios()
  }

  ngOnInit() {
    this.loadMap()
    console.log(this.appcomponent.usuario)
  }


  openMenu() {
    this.menucontroller.toggle('principal');
  }



  map: any;
  directionsDisplay = new google.maps.DirectionsRenderer();
  // parque simon bolivar
  origin = { lat: -1.492898, lng: -78.014910 };
  loadMap() {
    // create a new map by passing HTMLElement
    const mapEle: HTMLElement = document.getElementById('map');
    // create map
    this.map = new google.maps.Map(mapEle, {
      center: this.origin,
      zoom: 17
    });

    this.directionsDisplay.setMap(this.map);

    google.maps.event.addListenerOnce(this.map, 'idle', () => {
      mapEle.classList.add('show-map');
      const marker = {
        position: {
          lat: -1.492898,
          lng: -78.014910,
        },
        title: 'PETLIFE'
      }
      this.addMarker(marker);
    });
  }

  addMarker(marker: Marker) {
    return new google.maps.Marker({
      position: marker.position,
      map: this.map,
      title: marker.title
    });
  }

  enviarcorreo() {
    const correo = {
      to: 'leandrogeorgis@gmail.com',
      message: {
        text: 'holaaaaaaaaaaa',
        subject: 'aqui va el aasusto del correo',
      }
    };
    console.log('formato del correo ' + correo)
    console.log(correo)
    this.firestoreservice.createDoc(correo, 'mail', this.firestoreservice.getId()).then(res => {
      console.log('correo enviado')
    }).catch(error => {
      console.log('correo no enviado')
    });
  }

  slideOpts = {
    initialSlide: 0,
    spaceBetween: 5,
    centeredSlides: true,
    slidesPerView: 1.6
  }
  comentarios: Comentarios[] = [];
  comentarioactivo = false;
  getComentarios() {

    this.firestoreservice.getCollectionWithCondition<Comentarios>('Comentarios', 'estado', '==', true).subscribe(res => {
      this.comentarios = res;
      console.log(this.comentarios)
      if (res.length == 0) {
        this.comentarioactivo = false
      } else {
        this.comentarioactivo = true
      }
    });
  }

  async agregarcomentario() {
    console.log(this.appcomponent.usuario)
    console.log(this.appcomponent.ConectadosSi)
    if (this.appcomponent.ConectadosSi == true) {
      const alert = this.alertController.create({
        //cssClass: 'my-custom-class',
        header: 'Dejanos un comentario😉',
        buttons: [
          {
            text: 'Enviar',
            handler: (data) => {
              if (data.coment === '') {
                console.log('esta vacio')
              } else {
                this.comentario.uidusu=this.appcomponent.usuario.uid
                this.comentario.comentario = data.coment;
                this.comentario.usuario = this.appcomponent.usuario.nombre
                console.log('this ' + this.comentario)
                console.log(this.comentario)
                this.presentLoading();
                this.firestoreservice.createDoc(this.comentario, 'Comentarios', this.comentario.id).then(res => {
                  this.nuevocomentario()
                  this.loading.dismiss();
                  this.presentToast('Comentario enviado con exito, espere aprobacion');
                }).catch(error => {
                  this.presentToast('No se pude guardar');
                });
              }
            }
          },
          {
            text: 'Cancelar',
            role: 'cancel',
            handler: (blah) => {
              console.log('cancelar')
            }
          }
        ],
        inputs: [
          {
            name: 'coment',
            type: 'textarea',
            placeholder: 'Comentario',
            attributes: {
              maxlength: 154,
            },
          },

        ]
      });
      (await alert).present();

    } else {
      const alert = this.alertController.create({
        //cssClass: 'my-custom-class',
        header: 'Aun no eres parte de Petlife?😔',
        message: 'Crea un cuenta en la zona de perfil para dejar un comentario',
        buttons: ['OK']
      });

      (await alert).present();
    }
    console.log(this.comentario)
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

  loading: HTMLIonLoadingElement;
  async presentToast(msg: string) {
    const toast = await this.toastController.create({
      message: msg,
      cssClass: 'normal',
      duration: 2000,
      color: 'light',
    });
    toast.present();
  }
nuevocomentario(){
  this.comentario= {
    id: this.firestoreservice.getId(),
    comentario: '',
    estado: 'solicitud',
    usuario: '',
    uidusu:''
  };
}
}
