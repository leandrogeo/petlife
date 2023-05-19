import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { Admins, Usuario } from 'src/app/models';
import { FirestoreService } from 'src/app/services/firestore.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-editarusu',
  templateUrl: './editarusu.component.html',
  styleUrls: ['./editarusu.component.scss'],
})
export class EditarusuComponent implements OnInit {
  uid: string
  usuario: Usuario = {
    uid: '',
    correo: '',
    contrasenia: '',
    celular: '',
    direccion: '',
    nombre: '',
    admin: false,
  };

  nuevoadmin: Admins = {
    idusu: '',
    nombre: ''
  }

  usuarios: Usuario[] = [];
  admin: Admins[] = [];
  siesadmins = false;
  visible: boolean = true;
  changetype: boolean = true;
  suscriberUserInfo: Subscription
  constructor(
    private activateroute: ActivatedRoute,
    public firestoreService: FirestoreService,
    private router: Router,
  ) { }
  ngOnInit() {
    this.uid = this.activateroute.snapshot.paramMap.get('uid')
    this.getUserInfo(this.uid)
  }
  cambiodeicono() {
    this.visible = !this.visible
    this.changetype = !this.changetype
  }

  getUserInfo(uid: string) {
    const path = 'Usuarios';
    try {
      this.suscriberUserInfo = this.firestoreService.getDoc<Usuario>(path, uid).subscribe(res => {
        if (res !== undefined) {
          this.usuario = res;
        }
      });

    } catch (error) {
      alert(error);
    }
    this.getadmin()
  }

  getadmin() {
    console.log('asdas')
    try {
      this.firestoreService.getCollection<Admins>('Admins').subscribe(res => {
        this.admin = res;
        console.log("this admisn")
        console.log(this.admin)
        const resultado = this.admin.filter(item => item.idusu == this.usuario.uid);
        console.log(resultado)
        if (resultado.length) {
          this.siesadmins = true;
        } else {
          this.siesadmins = false;
        }
      });
    } catch (error) {
      alert(error);
    }
  }
 

  async guardarUser() {
    const path = 'Usuarios';
    const name = this.usuario.nombre;
    console.log(this.usuario)
    this.firestoreService.createDoc(this.usuario, path, this.usuario.uid).then(res => {
    }).catch(error => {
      alert(error)
    });
    this.nuevoadmin.idusu = this.usuario.uid
    this.nuevoadmin.nombre = this.usuario.nombre
    if (this.siesadmins) {
      console.log('ahora es admins')
      this.firestoreService.createDoc(this.nuevoadmin, 'Admins', this.nuevoadmin.idusu).then(res => {
      }).catch(error => {
        alert(error)
      });
    } else {
      this.firestoreService.deleteDoc('Admins', this.nuevoadmin.idusu).then(res => {
      }).catch(error => {
        alert(error)
      });
      console.log('ya no es admin')
    }
    this.router.navigate(['/buscar']);
  }

}