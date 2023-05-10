import { Component, OnInit } from '@angular/core';
import { Citas } from 'src/app/models';
import { FirestoreService } from 'src/app/services/firestore.service';
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";

import { DatePipe } from '@angular/common';


pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-reportecitasgeneral',
  templateUrl: './reportecitasgeneral.component.html',
  styleUrls: ['./reportecitasgeneral.component.scss'],
})
export class ReportecitasgeneralComponent implements OnInit {

  constructor(
    public firestoreservice: FirestoreService,
  ) { }


  data: any[] = [['Codigo', 'Nombre de la mascota', 'Fecha', 'Motivo', 'Diagnostico', 'Estado de la cita'],];
  info: any;

  desdeescogido = false;
  desbloquearboton = true;
  mostrarreporte = false;
  totalcitas = 0;
  minhasta: any;
  pdfObj: any;
  today: any;
  desde: string;
  hasta: string;
  Citas: Citas[] = [];
  ngOnInit() {
    this.getAcutualDate();
  }



  getAcutualDate() {
    const date = new Date();
    this.today = date.getFullYear() + '-' + ('0' + (date.getMonth() + 1)).slice(-2) + '-' + ('0' + date.getDate()).slice(-2);
  }

  fechaescogida() {
    this.desdeescogido = true;
  }

  hastaescogido() {
    this.desbloquearboton = false;
  }

  generarpdf() {
    console.log('desde ' + this.desde)
    console.log('hasta ' + this.hasta)
    this.hasta
    const path = 'Citas';

    try {
      this.firestoreservice.getCollectioncitasreporte<Citas>(path, 'fecha_cita', '>=', this.desde, 'fecha_cita', '<=', this.hasta).subscribe(res => {
        this.Citas = res;
        console.log(this.Citas)
        for (var i = 0; i <= this.Citas.length - 1; i++) {
          this.info = [this.Citas[i]['id_cita'], this.Citas[i]['namepet'],this.cambiarfecha(this.Citas[i]['fecha_cita']) , this.Citas[i]['motivo_cita'], this.Citas[i]['diagnostico'], this.Citas[i]['estadodelacita']]

          this.data[i + 1] = this.info
          this.info = ''
          //this.data[i+1][1] = this.Citas[0]['diagnostico']
        };
        console.log('this.data')
        console.log(this.data)
      });


      console.log('data')
      console.log(this.data)
      this.mostrarreporte = true;
    } catch (error) {
      alert(error);
      this.desbloquearboton = true;
    }
  }

  pdf() {
    const docDef = {
      pageSize: 'A4',
      pageOrientation: 'portait',
      pageMargins: [20, 10, 40, 60],

      content: [
        {
          text: 'Reporte de consultas',
          alignment: 'center',
          bold: true,
          fontSize: 20,
        },

        {
          text: 'desde ' + this.desde + " hasta " + this.hasta,
          alignment: 'center',
          fontSize: 10,
        },
        {
          table: {
            headerRows: 1,
            body: this.data
          }

        }

      ]
    }

    this.pdfObj = pdfMake.createPdf(docDef);
    this.pdfObj.download('demo');
  }

  cambiarfecha(fecha){
    const datePipe = new DatePipe('en-US');
    let fechaFormateada = datePipe.transform(fecha, 'dd/MM/yyyy');

    return fechaFormateada
  }

}
