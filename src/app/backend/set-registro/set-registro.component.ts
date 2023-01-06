import { Component, OnInit } from '@angular/core';
import { AlertController, LoadingController, MenuController, ToastController } from '@ionic/angular';
import { stringify } from 'querystring';
import { Producto } from 'src/app/models';
import { FirestoreService } from '../../services/firestore.service';
import { FirestorageService } from '../../services/firestorage.service';


@Component({
  selector: 'app-set-registro',
  templateUrl: './set-registro.component.html',
  styleUrls: ['./set-registro.component.scss'],
})
export class SetRegistroComponent implements OnInit {

  productos: Producto[] = [];
  listallena = true;
  newProducto: Producto;
  enableNewProducto = false;
  private path = 'Productos/';
  newImage = '';
  newFile: any;
  loading: any;

  constructor(
    public menuController: MenuController,
    public firestoreservice: FirestoreService,
    public menucontroler: MenuController,
    public firestoreService: FirestoreService,
    public loadingController: LoadingController,
    public toastController: ToastController,
    public alertController: AlertController,
    public firestorageservice: FirestorageService) {

  }

  ngOnInit() {
    this.getProductos();
  }

  openMenu() {
    console.log('open menu');
    this.menuController.toggle('principal');
  }

  async guardarProducto() {
    this.presentLoading();
    const path = 'Productos';
    const name = this.newProducto.nombredelamascota;
    if (this.newFile !== undefined) {
      const res = await this.firestorageservice.uploadImage(this.newFile, path, name);
      this.newProducto.foto = res;
    }
    this.firestoreservice.createDoc(this.newProducto, this.path, this.newProducto.id).then(res => {
      this.loading.dismiss();
      this.presentToast('Guardo con exito');
      this.nuevo();
      this.enableNewProducto = false
    }).catch(error => {
      this.presentToast('No se pude guardar');
    });
  }

  getProductos() {
    this.firestoreservice.getCollection<Producto>(this.path).subscribe(res => {
      this.productos = res;
      if (res.length==0){
        this.listallena = false;
      }else{

        this.listallena = true;
      }

    });
  }

  async deleteProducto(producto: Producto) {

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
            console.log('Confirm Cancel: blah');
            // this.alertController.dismiss();
          }
        }, {
          text: 'Ok',
          handler: () => {
            console.log('Confirm Okay');
            this.firestoreService.deleteDoc(this.path, producto.id).then(res => {
              this.presentToast('eliminado con exito');
              this.alertController.dismiss();
              this.nuevo();
              this.enableNewProducto = false
            }).catch(error => {
              this.presentToast('no se pude eliminar');
            });
          }
        }
      ]
    });
    await alert.present();
  }

  nuevo() {
    this.enableNewProducto = true;
    this.newProducto = {
      nombredelamascota: '',
      tutor: '',
      fechadenacimiento: new Date(),
      especie: '',
      sexo: '',
      telefonotutor: '',
      foto: 'htt',
      id: this.firestoreService.getId(),
    };
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

  async newImageUpload(event: any) {
    if (event.target.files && event.target.files[0]) {
      this.newFile = event.target.files[0];
      const reader = new FileReader();
      reader.onload = ((image) => {
        this.newProducto.foto = image.target?.result as string;
      });
      reader.readAsDataURL(event.target.files[0]);
    }
  }


}
