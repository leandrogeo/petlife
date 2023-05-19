import { Component, OnInit } from '@angular/core';
import {  MenuController } from '@ionic/angular';
import { Producto } from 'src/app/models';
import { ActivatedRoute } from '@angular/router';
import { FirestoreService } from '../../services/firestore.service'; 

@Component({
  selector: 'app-mascotas',
  templateUrl: './mascotas.component.html',
  styleUrls: ['./mascotas.component.scss'],
})
export class MascotasComponent implements OnInit {

  constructor(
    public menuController: MenuController,
    public firestoreservice: FirestoreService,
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
      this.productos = res;
      if (res.length == 0) {
        this.listallena = false;
      } else {

        this.listallena = true;
      }

    });
  }

}
