import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Platform } from '@ionic/angular';
import { Producto, Vacunas } from 'src/app/models';
import { FirestoreService } from 'src/app/services/firestore.service';
import html2canvas from 'html2canvas';
import pdfMake from "pdfmake/build/pdfmake";

@Component({
  selector: 'app-vistadesparacitacion',
  templateUrl: './vistadesparacitacion.component.html',
  styleUrls: ['./vistadesparacitacion.component.scss'],
})
export class VistadesparacitacionComponent implements OnInit {

  constructor(
    private activateroute: ActivatedRoute,
    public firestoreservice: FirestoreService,
    private platform: Platform,
  ) { }
  uid: string;
  idmascota: string;
  idvacuna: string;

  vacuna: Vacunas = {
    id_vac: '',
    fecha_vac: '',
    peso_vac: '',
    vacunas: '',
    proxi_vac: '',
  }
  largo = 300;
  ancho = 525;
  base64Image: any;
  nommasc:string;
  pdfObj: any;

  ngOnInit() {
    this.uid = this.activateroute.snapshot.paramMap.get('uid')
    this.idmascota = this.activateroute.snapshot.paramMap.get('idmas')
    this.idvacuna = this.activateroute.snapshot.paramMap.get('idvac')
    this.getvacuna();
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
      console.log('Estás en una plataforma desconocida');
    }
  }
  
  getmas() {
    const path = 'Usuarios/' + this.uid + '/Mascotas/' ;
    this.firestoreservice.getDoc<Producto>(path, this.idmascota).subscribe(res => {
      if (res !== undefined) {
        this.nommasc = res.nombredelamascota;
      }
    });
  }

  getvacuna() {
    const path = 'Usuarios/' + this.uid + '/Mascotas/' + this.idmascota + '/Vacunacion/';
    this.firestoreservice.getDoc<Vacunas>(path, this.idvacuna).subscribe(res => {
      if (res !== undefined) {
        this.vacuna = res;
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
            text: 'Vacuna de: '+ this.nommasc,style: 'header'
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
      this.pdfObj.download('Vacuna: ' + this.vacuna.id_vac);
    });
  }

}
