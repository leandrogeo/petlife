import { Component, OnInit } from '@angular/core';
import { MenuController, ToastController } from '@ionic/angular';
import { Producto } from 'src/app/models';
import { FirebaseauthService } from 'src/app/services/firebaseauth.service';
import { FirestoreService } from 'src/app/services/firestore.service';

@Component({
  selector: 'app-carnet',
  templateUrl: './carnet.component.html',
  styleUrls: ['./carnet.component.scss'],
})
export class CarnetComponent implements OnInit {

  listallena = true;

  uid: string;
  productos: Producto[] = [];
  public results = [...this.productos];


  constructor(
    public menucontroller: MenuController,
    public firebaseauthService: FirebaseauthService,
    public firestoreservice: FirestoreService,) {
      this.firebaseauthService.stateAuth().subscribe(res => {
        if (res !== null) {
          this.uid = res.uid
          this.getProductos(res.uid);
        } else {
  
        }
      });
     }
 
  ngOnInit() {}

  openMenu() {
    this.menucontroller.toggle('principal');
  }

  async getProductos(id) {
    // const path = 'Usuarios/' + id + '/Mascotas/';
    // this.firestoreservice.getCollection<Producto>(path).subscribe(res => {
    //   this.productos = res;
    //   this.results=this.productos
    //   if (res.length == 0) {
    //     console.log("no hay mascotas "+res)
    //   }
    // });


    const path = 'Usuarios/' + id + '/Mascotas/';
      this.firestoreservice.getCollectionWithCondition<Producto>(path,'estado','==',true).subscribe(res => {
        this.productos = res;
        this.results=this.productos;
        if (res.length == 0) {
          console.log("no hay mascotas "+res)
        }
      });
  }

  buscar(event){
    const buscar = event.target.value.toLowerCase();
    this.results=this.productos
    if(buscar && buscar.trim() != ''){
      this.results=this.results.filter((productos:any)=>{
        return (productos.nombredelamascota.toLowerCase().indexOf(buscar.toLowerCase())>-1);

      })
    }
  }


}
