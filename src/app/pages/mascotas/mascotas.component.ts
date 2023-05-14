import { Component, OnInit } from '@angular/core';
import { AlertController, LoadingController, MenuController, ToastController } from '@ionic/angular';
import { Producto } from 'src/app/models';
import { ActivatedRoute } from '@angular/router';
import { FirestoreService } from '../../services/firestore.service'; 
import { FirestorageService } from '../../services/firestorage.service';
import { FirebaseauthService } from '../../services/firebaseauth.service';

@Component({
  selector: 'app-mascotas',
  templateUrl: './mascotas.component.html',
  styleUrls: ['./mascotas.component.scss'],
})
export class MascotasComponent implements OnInit {

  constructor(
    public menuController: MenuController,
    public firebaseauthService: FirebaseauthService,
    public firestoreservice: FirestoreService,
    public firestoreService: FirestoreService,
    public loadingController: LoadingController,
    public toastController: ToastController,
    public alertController: AlertController,
    public firestorageservice: FirestorageService,
    private activateroute: ActivatedRoute,
  ) { }

  productos: Producto[] = [];
  listallena = true;
  uid:string 

  ngOnInit() {
    this.uid=this.activateroute.snapshot.paramMap.get('uid')
    this.getProductos(this.uid);
  }

  async getProductos(id: string) {
    const path = 'Usuarios/' + id + '/Mascotas/';
    this.firestoreservice.getCollection<Producto>(path).subscribe(res => {
      console.log('producot res')
      console.log(path)
      this.productos = res;
      console.log(res)
      if (res.length == 0) {
        this.listallena = false;
      } else {

        this.listallena = true;
      }

    });
  }

}
