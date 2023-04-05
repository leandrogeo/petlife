import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AlertController, LoadingController, ToastController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { Citas, Desp, Producto, Vacunas } from 'src/app/models';
import { FirebaseauthService } from 'src/app/services/firebaseauth.service';
import { FirestorageService } from 'src/app/services/firestorage.service';
import { FirestoreService } from 'src/app/services/firestore.service';

@Component({
  selector: 'app-visualizarcarnet',
  templateUrl: './visualizarcarnet.component.html',
  styleUrls: ['./visualizarcarnet.component.scss'],
})
export class VisualizarcarnetComponent implements OnInit, OnDestroy {

  mascota: Producto = {
    nombredelamascota: '',
    tutor: '',
    fechadenacimiento: '',
    especie: '',
    sexo: '',
    telefonotutor: '',
    foto: '',
    uidtutor:'',
    id: '',
  };
  id: string;
  uid:string;
  suscriberUserInfo: Subscription;
  desparacitaciones:Desp[]=[];
  vacunas:Vacunas[]=[];
  listallena = true;
  atendidoSuscriber: Subscription;
  agendadosSuscriber: Subscription;
  Citas: Citas[]=[]

  constructor(
    private activateroute: ActivatedRoute,
    public firebaseauthService: FirebaseauthService,
    public firestoreservice: FirestoreService,
    public loadingController: LoadingController,
    public toastController: ToastController,
    public alertController: AlertController,
    public firestorageservice: FirestorageService,
  ) { 
    this.firebaseauthService.stateAuth().subscribe(res => {
      if (res !== null) {
        this.uid = res.uid
        this.getUserInfo2(this.uid, this.id);
        this.getdesparacitacion(this.uid,this.id);
        this.getvacunas(this.uid,this.id)
        this.getCitasAgendadas(this.uid,this.id)
      } else {
        console.log("no inision sesion")
        
      }
    });
  }

  ngOnInit() {
    this.id = this.activateroute.snapshot.paramMap.get('id')
    console.log("iddd " +this.id)
    
  }
  ngOnDestroy() {
    if(this.atendidoSuscriber){
      this.atendidoSuscriber.unsubscribe
    }
    if(this.agendadosSuscriber){
      this.agendadosSuscriber.unsubscribe
    }
  }

  getUserInfo2(uid: string, id: string) {
    const path2 = 'Usuarios/' + uid + '/Mascotas/';
    this.suscriberUserInfo = this.firestoreservice.getDoc<Producto>(path2, id).subscribe(res => {

      if (res !== undefined) {
        this.mascota = res;

      }
    });
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

  changeSegment(eve:any){

    const opc =eve.detail.value
    if(opc === 'agendada'){
      this.getCitasAgendadas(this.uid,this.id)
    }
    if(opc === 'atendida'){
      this.getCitasAtendidas(this.uid,this.id)

    }
  }


  async getCitasAtendidas(uid:string,id:string){
    console.log("atendidas citas")
    const path = 'Usuarios/' + uid + '/Mascotas/' + id + '/Citas';
    
    this.atendidoSuscriber = this.firestoreservice.getCollectionQuery<Citas>(path, 'estadodelacita', '==', 'atendido').subscribe(res => {
      if (res.length) {
        this.Citas=res;
        this.listallena = true;
        console.log(this.Citas)
      }else{
        this.listallena = false;
      }
    });

  }

  async getCitasAgendadas(uid:string,id:string){
    console.log("agendadas citas")

    const path = 'Usuarios/' + uid + '/Mascotas/' + id + '/Citas';
    console.log("path "+ path)
    this.agendadosSuscriber = this.firestoreservice.getCollectionQuery<Citas>(path, 'estadodelacita', '==', 'agendado').subscribe(res => {
      if (res.length) {
        this.Citas=res;
        this.listallena = true;
        console.log(this.Citas)
      }else{
        this.listallena = false;
      }
    });
  }

}
