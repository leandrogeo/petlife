import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Desp, Producto } from 'src/app/models';
import { FirestoreService } from 'src/app/services/firestore.service';
import html2canvas from 'html2canvas';
import pdfMake from "pdfmake/build/pdfmake";
import { Platform } from '@ionic/angular';


@Component({
  selector: 'app-vistades',
  templateUrl: './vistades.component.html',
  styleUrls: ['./vistades.component.scss'],
})
export class VistadesComponent implements OnInit {

  constructor(
    private activateroute: ActivatedRoute,
    public firestoreservice: FirestoreService,
    private platform: Platform,
  ) { }
  uid: string;
  idmascota: string;
  iddes: string;
  base64Image: any;
  despa: Desp = {
    id_des: '',
    fecha_des: '',
    peso_des: '',
    producto_des: '',
    proxi_des: '',
  }
  pdfObj: any;
  largo = 300;
  ancho = 525;
  docDef: any
  nommasc:string
  ngOnInit() {
    this.uid = this.activateroute.snapshot.paramMap.get('uid')
    this.idmascota = this.activateroute.snapshot.paramMap.get('idmas')
    this.iddes = this.activateroute.snapshot.paramMap.get('iddes')
    this.getdespa(); 
    this.getmas();

    if (this.platform.is('ipad')) {
      this.largo = 325;
      this.ancho = 575;
    } else if (this.platform.is('desktop')) {
      this.largo = 325;
      this.ancho = 575;
    } else if (this.platform.is('android') || this.platform.is('ios')) {
      this.largo = 525;
      this.ancho = 400;
    }
    else {
    }
  }



  getdespa() {
    const path = 'Usuarios/' + this.uid + '/Mascotas/' + this.idmascota + '/Desparacitacion/';
    this.firestoreservice.getDoc<Desp>(path, this.iddes).subscribe(res => {
      if (res !== undefined) {
        this.despa = res;
      }
    });
  }

  getmas() {
    const path = 'Usuarios/' + this.uid + '/Mascotas/' ;
    this.firestoreservice.getDoc<Producto>(path, this.idmascota).subscribe(res => {
      if (res !== undefined) {
        this.nommasc = res.nombredelamascota;
      }
    });
  }


  pdf() {
    const cardElement = document.getElementById('myCard')
    html2canvas(cardElement).then(canvas => {
      const base64Image = canvas.toDataURL();
      this.base64Image = base64Image;
      const docDef = {
        pageSize: 'A4',
        pageOrientation: 'portait',
        content: [
          {
            text: 'Desparacitacion de: '+ this.nommasc,style: 'header'
          },
          {
            image: this.base64Image,
            width: this.ancho,
            height:this.largo,
            alignment: 'center',
          },
        ],
        styles: {
          header: {
            fontSize: 20,
            bold: true,
            margin: [0, 10, 0, 0],
            alignment: 'center',
          },
        }
      }

      this.pdfObj = pdfMake.createPdf(docDef);
      this.pdfObj.download('Desparacitacion: ' + this.despa.id_des);
    });


  }

}
