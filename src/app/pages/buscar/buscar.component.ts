import { Component, OnInit } from '@angular/core';
import { AlertController, LoadingController, MenuController, ToastController } from '@ionic/angular';
import { stringify } from 'querystring';
import { Producto } from 'src/app/models';
import { FirestoreService } from '../../services/firestore.service';
import { FirestorageService } from '../../services/firestorage.service';
import { FirebaseauthService } from '../../services/firebaseauth.service';
import { Usuario } from '../../models';
import { Subscription } from 'rxjs';
import { Console } from 'console';

@Component({
  selector: 'app-buscar',
  templateUrl: './buscar.component.html',
  styleUrls: ['./buscar.component.scss'],
})
export class BuscarComponent implements OnInit {

  constructor(public menuController: MenuController,
    public firebaseauthService: FirebaseauthService,
    public firestoreservice: FirestoreService,
    public firestoreService: FirestoreService,
    public loadingController: LoadingController,
    public toastController: ToastController,
    public alertController: AlertController,
    public firestorageservice: FirestorageService) { }

  usuarios: Usuario[] = [];
  public results = [...this.usuarios];

  listallena = true;
  ngOnInit() {
    this.getProductos();
  }

  openMenu() {
    console.log('open menu');
    this.menuController.toggle('principal');
  }


  buscar(event) {
    const buscar = event.target.value.toLowerCase();
    this.results = this.usuarios
    if (buscar && buscar.trim() != '') {
      this.results = this.results.filter((usuarios: any) => {
        console.log('sdaf')
        console.log(this.results)
        return (usuarios.nombre.toLowerCase().indexOf(buscar.toLowerCase()) > -1);

      })
    }
  }

  async getProductos() {
    const path = 'Usuarios/';
    //console.log('uid> '+ this.path1)
    this.firestoreservice.getCollection<Usuario>(path).subscribe(res => {
      this.usuarios = res;
      this.results = this.usuarios
      if (res.length == 0) {
        this.listallena = false;
      } else {
        this.listallena = true;
      }
    });
  }



}
