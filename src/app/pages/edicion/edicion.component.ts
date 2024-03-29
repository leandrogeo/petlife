import { Component, OnInit } from '@angular/core';
import { AlertController, MenuController, ToastController } from '@ionic/angular';
import { Comentarios, Producto, servicios } from 'src/app/models';
import { FirestoreService } from 'src/app/services/firestore.service';

@Component({
  selector: 'app-edicion',
  templateUrl: './edicion.component.html',
  styleUrls: ['./edicion.component.scss'],
})
export class EdicionComponent implements OnInit {
  activomascotas = false
  constructor(public menucontroller: MenuController,
    public firestoreservice: FirestoreService,
    public alertController: AlertController,
    public toastController: ToastController,) {
    this.getServicios()
    this.getProductos()
    this.getComentarios()
  }
  servicios: servicios[] = [];
  listallena = false;
  nuevo = false;
  servicio: servicios = {
    id_servicio: this.firestoreservice.getId(),
    tipo_servicio: '',
    precio_servicio: '',
    estado_servicio: true,
  };
  ngOnInit() { }
  openMenu() {
    this.menucontroller.toggle('principal');
  }


  getServicios() {
    this.firestoreservice.getCollection<servicios>('Servicios').subscribe(res => {
      this.servicios = res;
      console.log(this.servicios)
      if (res.length == 0) {
        this.listallena = false;
      } else {
        this.listallena = true;
      }
    });
  }

  nuevoclick() {
    this.nuevo = !this.nuevo
  }
  async setServicio() {
    const path = 'Servicios';
    if (this.servicio.precio_servicio != '') {
      if (this.servicio.tipo_servicio != '') {
        this.nuevo = !this.nuevo
        this.firestoreservice.createDoc(this.servicio, path, this.servicio.id_servicio).then(res => {
          console.log('guardado servicio')
          this.servicio = {
            id_servicio: this.firestoreservice.getId(),
            tipo_servicio: '',
            precio_servicio: '',
            estado_servicio: true,
          };
        }).catch(error => {
          console.log(error)
        });
      } else {
        const alert = await this.alertController.create({
          //cssClass: 'my-custom-class',
          header: 'Fallo al agregar nuevo servicio',
          message: 'Por favor llenar el campo Tipo de servicio',
          buttons: ['OK']
        });
        await alert.present();
      }
    } else {
      const alert = await this.alertController.create({
        //cssClass: 'my-custom-class',
        header: 'Fallo al agregar nuevo servicio',
        message: 'Por favor llenar el campo Precio de servicio',
        buttons: ['OK']
      });
      await alert.present();
    }
  }

  async DeleteService(idservicio) {
    const path = 'Servicios';
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
            this.firestoreservice.deleteDoc(path, idservicio).then(res => {
              this.presentToast('eliminado con exito');
              this.alertController.dismiss();
            }).catch(error => {
              this.presentToast('no se pude eliminar');
            });
          }
        }
      ]
    });
    await alert.present();
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

  valormascotas = 12
  productos: Producto[] = [];
  async getProductos() {
    const path = 'Mascotas';
    console.log(this.productos)
    this.firestoreservice.getCollectionCitasgene<Producto>(path, 'estado', '==', 'solicitud').subscribe(res => {
      this.productos = res;
      if (res.length == 0) {
        console.log('no hay mascota')
        this.activomascotas = false
      } else {
        this.valormascotas = res.length
        this.activomascotas = true
      }
    });
  }
   async negar(idusuario,idmascota){
    //const uid = await this.firebaseauthService.getUid();

    const path = 'Usuarios/' + idusuario + '/Mascotas/';
    const alert = await this.alertController.create({
      cssClass: 'normal',
      header: 'Advertencia',
      message: ' Seguro desea <strong>NEGAR</strong> este registro',
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
            this.firestoreservice.deleteDoc(path, idmascota).then(res => {
              this.presentToast('Registro negado');
              this.alertController.dismiss();
            }).catch(error => {
              this.presentToast('no se pude eliminar');
            });

          }
        }
      ]
    });
    await alert.present();
  }

  aprobar(idusuario,idmascota){
    const path = 'Usuarios/' + idusuario + '/Mascotas/';
    this.firestoreservice.updateDoc({'estado': true},path,idmascota).then(res => {
      this.presentToast('Actualizado');
      this.alertController.dismiss();
    }).catch(error => {
      this.presentToast('no se pude eliminar');
    });

  }


  valorcomentarios= 0;
  activocomentarios=false;
  comentarios: Comentarios[] = [];
  comentariosautorizados: Comentarios[] = [];
  async getComentarios() {
    const path = 'Comentarios';
    console.log(this.comentarios)
    this.firestoreservice.getCollectionCitasgene<Comentarios>(path, 'estado', '!=', 'solicitud').subscribe(res => {
      this.comentariosautorizados = res;
    });




    this.firestoreservice.getCollectionCitasgene<Comentarios>(path, 'estado', '==', 'solicitud').subscribe(res => {
      this.comentarios = res;
      if (res.length == 0) {
        console.log('no hay mascota')
        this.activocomentarios = false
      } else {
        this.valorcomentarios = res.length
        this.activocomentarios = true
      }
    });
  }

  async negarcoment(idusuario,idmascota){
    //const uid = await this.firebaseauthService.getUid();

    const path = 'Comentarios';
    const alert = await this.alertController.create({
      cssClass: 'normal',
      header: 'Advertencia',
      message: ' Seguro desea <strong>Borrar</strong> este comentario',
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
            this.firestoreservice.deleteDoc(path, idmascota).then(res => {
              this.presentToast('Comentario borrado');
              this.alertController.dismiss();
            }).catch(error => {
              this.presentToast('no se pude eliminar');
            });

          }
        }
      ]
    });
    await alert.present();
  }

  aprobarcoment(idusuario,idmascota){
    const path = 'Comentarios';
    this.firestoreservice.updateDoc({'estado': true},path,idmascota).then(res => {
      this.presentToast('Comentario publicado');
      this.alertController.dismiss();
    }).catch(error => {
      this.presentToast('no se pude eliminar');
    });

  }


}
