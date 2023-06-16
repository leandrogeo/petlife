import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { Citas, Desp, Producto, Vacunas } from 'src/app/models';
import { FirebaseauthService } from 'src/app/services/firebaseauth.service';
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
    estado: 'false'
  };
  id: string;
  uid:string;
  suscriberUserInfo: Subscription;
  desparacitaciones:Desp[]=[];
  vacunas:Vacunas[]=[];
  listallena = false;
  listades = false;
  listavac = false;
  listacon = false;
  atendidoSuscriber: Subscription;
  agendadosSuscriber: Subscription;
  Citas: Citas[]=[]

  constructor(
    private activateroute: ActivatedRoute,
    public firebaseauthService: FirebaseauthService,
    public firestoreservice: FirestoreService,
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
    this.listallena=false;
    const path = 'Usuarios/' + uid + '/Mascotas/'+id+'/Desparacitacion';
     this.firestoreservice.getCollection<Desp>(path).subscribe(res => {
      this.desparacitaciones = res;
      if (res.length == 0) {
        this.listades = false;
      } else {
        this.listades = true;
      }

    });
  }


  //PROCESO DE CONSULTAO DE VACUNAS
  getvacunas(uid:string,id:string) {
    this.listallena=false;
    const path = 'Usuarios/' + uid + '/Mascotas/'+id+'/Vacunacion';
    this.firestoreservice.getCollection<Vacunas>(path).subscribe(res => {
     this.vacunas = res;
     if (res.length == 0) {
       this.listavac = false;
     } else {
       this.listavac = true;
     }

   });
  }


  //PROCESO DE CONSULTAS DE CITAS

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
    const path = 'Usuarios/' + uid + '/Mascotas/' + id + '/Citas';
    
    this.atendidoSuscriber = this.firestoreservice.getCollectionQuery<Citas>(path, 'estadodelacita', '==', 'atendido').subscribe(res => {
      if (res.length) {
        this.Citas=res;
        this.listallena = true;
      }else{
        this.listallena = false;
      }
    });

  }

  async getCitasAgendadas(uid:string,id:string){

    const path = 'Usuarios/' + uid + '/Mascotas/' + id + '/Citas';
    this.agendadosSuscriber = this.firestoreservice.getCollectionQuery<Citas>(path, 'estadodelacita', '==', 'agendado').subscribe(res => {
      if (res.length) {
        this.Citas=res;
        this.listallena = true;
      }else{
        this.listallena = false;
      }
    });
  }

}
