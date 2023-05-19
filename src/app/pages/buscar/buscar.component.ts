import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { FirestoreService } from '../../services/firestore.service';
import { Usuario } from '../../models';

@Component({
  selector: 'app-buscar',
  templateUrl: './buscar.component.html',
  styleUrls: ['./buscar.component.scss'],
})
export class BuscarComponent implements OnInit {

  constructor(public menuController: MenuController,
    public firestoreservice: FirestoreService, ) { }

  usuarios: Usuario[] = [];
  public results = [...this.usuarios];

  listallena = true;
  ngOnInit() {
    this.getProductos();
  }

  openMenu() {
    this.menuController.toggle('principal');
  }


  buscar(event) {
    const buscar = event.target.value.toLowerCase();
    this.results = this.usuarios
    if (buscar && buscar.trim() != '') {
      this.results = this.results.filter((usuarios: any) => {
        return (usuarios.nombre.toLowerCase().indexOf(buscar.toLowerCase()) > -1);

      })
    }
  }

  async getProductos() {
    const path = 'Usuarios/';
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
