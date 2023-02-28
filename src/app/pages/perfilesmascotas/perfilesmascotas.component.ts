import { Component, OnInit } from '@angular/core';
import { AlertController, LoadingController, MenuController, ToastController } from '@ionic/angular';
import { stringify } from 'querystring';
import { Producto, Vacunas } from 'src/app/models';
import { ActivatedRoute } from '@angular/router';
import { FirestoreService } from '../../services/firestore.service';
import { FirestorageService } from '../../services/firestorage.service';
import { FirebaseauthService } from '../../services/firebaseauth.service';
import { Usuario, Desp } from '../../models';
import { Subscription } from 'rxjs';
import { Console } from 'console';

@Component({
  selector: 'app-perfilesmascotas',
  templateUrl: './perfilesmascotas.component.html',
  styleUrls: ['./perfilesmascotas.component.scss'],
})
export class PerfilesmascotasComponent implements OnInit {

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
  desparacitaciones:Desp[]=[];
  vacunas:Vacunas[]=[];



  listallena = true;
  uid: string
  id: string;
  segmento=1;
  mascota: Producto = {

    nombredelamascota: '',
    tutor: '',
    fechadenacimiento: new Date,
    especie: '',
    sexo: '',
    telefonotutor: '',
    foto: '',
    id: '',
  };
  suscriberUserInfo: Subscription;

  ngOnInit() {
    this.uid = this.activateroute.snapshot.paramMap.get('uid')
    this.id = this.activateroute.snapshot.paramMap.get('id')
    this.getUserInfo2(this.uid, this.id);
    this.getdesparacitacion(this.uid,this.id);
    
  }

  getUserInfo2(uid: string, id: string) {
    const path2 = 'Usuarios/' + uid + '/Mascotas/';
    this.suscriberUserInfo = this.firestoreService.getDoc<Producto>(path2, id).subscribe(res => {
      if (res !== undefined) {
        this.mascota = res;
        console.log(this.mascota);
      }
    });
  }

  cambio(event: any) {

    const opc = event.detail.value
    if (opc === '1') {
      this.getdesparacitacion(this.uid,this.id);

    }
    if (opc === '2') {
      this.getvacunas(this.uid,this.id);
    }
    if (opc === '3') {
      this.getconsultas(this.uid,this.id);
    }
  }

  getdesparacitacion(uid:string,id:string) {
    const path = 'Usuarios/' + uid + '/Mascotas/'+id+'/Desparacitacion';
     this.firestoreservice.getCollection<Desp>(path).subscribe(res => {
      this.desparacitaciones = res;
      if (res.length == 0) {
        this.listallena = false;
      } else {
        this.listallena = true;
      }

    });
  }

  getvacunas(uid:string,id:string) {
    console.log('vacunas')
    const path = 'Usuarios/' + uid + '/Mascotas/'+id+'/Vacunacion';
    this.firestoreservice.getCollection<Vacunas>(path).subscribe(res => {
     this.vacunas = res;
     if (res.length == 0) {
       this.listallena = false;
     } else {
       this.listallena = true;
     }

   });
  }

  getconsultas(uid:string,id:string) {
    console.log('consultas')
  }
}
