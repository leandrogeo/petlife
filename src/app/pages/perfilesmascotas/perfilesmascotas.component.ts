import { Component, OnInit } from '@angular/core';
import { MenuController, ToastController } from '@ionic/angular';
import { Citas, Producto, Vacunas } from 'src/app/models';
import { ActivatedRoute } from '@angular/router';
import { FirestoreService } from '../../services/firestore.service';
import { Desp } from '../../models';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-perfilesmascotas',
  templateUrl: './perfilesmascotas.component.html',
  styleUrls: ['./perfilesmascotas.component.scss'],
})
export class PerfilesmascotasComponent implements OnInit {

  constructor(
    public menuController: MenuController,
    public firestoreservice: FirestoreService,
    public firestoreService: FirestoreService,
    private activateroute: ActivatedRoute,
  ) { }


  productos: Producto[] = [];
  desparacitaciones:Desp[]=[];
  vacunas:Vacunas[]=[];
  Citas: Citas[]=[]
  listallena = true;
  listades = false;
  listavac = false;
  listacon = false;


  uid: string
  id: string;
  segmento=1;
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
  suscriberUserInfo: Subscription;

  ngOnInit() {
    this.uid = this.activateroute.snapshot.paramMap.get('uid')
    this.id = this.activateroute.snapshot.paramMap.get('id')
    this.getUserInfo2(this.uid, this.id);
    this.getdesparacitacion(this.uid,this.id);
    this.getvacunas(this.uid,this.id)
    this.getCitasAgendadas(this.uid,this.id)
    
  }

  getUserInfo2(uid: string, id: string) {
    const path2 = 'Usuarios/' + uid + '/Mascotas/';
    this.suscriberUserInfo = this.firestoreService.getDoc<Producto>(path2, id).subscribe(res => {
      if (res !== undefined) {
        this.mascota = res;
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

    }
  }

  getdesparacitacion(uid:string,id:string) {
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

  getvacunas(uid:string,id:string) {
    this.listallena=false
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

  atendidoSuscriber: Subscription;
  agendadosSuscriber: Subscription;

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
