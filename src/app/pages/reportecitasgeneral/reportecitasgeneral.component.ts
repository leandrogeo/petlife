import { Component, OnInit } from '@angular/core';
import { Citas } from 'src/app/models';
import { FirestoreService } from 'src/app/services/firestore.service';
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";



import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';


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
    console.log('today ' + this.today)
  }



  getAcutualDate() {
    const date = new Date();
    this.today = date.getFullYear() + '-' + ('0' + (date.getMonth() + 1)).slice(-2) + '-' + ('0' + date.getDate()).slice(-2);
    console.log(this.today);
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

    const path = 'Citas';
    try {
      this.firestoreservice.getCollectioncitasreporte<Citas>(path, 'fecha_cita', '>=', this.desde, 'fecha_cita', '<=', this.hasta).subscribe(res => {
        this.Citas = res;
        console.log("si 1")
        console.log(this.Citas.length)
        this.totalcitas = this.Citas.length
      })
      this.mostrarreporte = true;
    } catch (error) {
      alert(error);
      this.desbloquearboton = true;
    }
/*
    const docDef = {
      pageSize: 'A4',
      pageOrientation: 'portait',
      pageMargins: [20, 10, 40, 60],
      
      content:[
        {
          text: 'Reporte de consultas' ,
          alignment: 'center',
          bold: true,
          fontSize: 20,
        },
        {
          text: 'desde ' + this.desde+ " hasta "+ this.hasta,
          alignment: 'center',
          fontSize: 10,
        },
        {

          table: {
            heights: function (row) {
              return (row + 1) * 25;
            },
            body: [
              ['row 1', 'column B'],
              ['row 2', 'column B'],
              ['row 3', 'column B']
            ]
          }

        }
        
      ]
    }

    this.pdfObj = pdfMake.createPdf(docDef);
    this.pdfObj.download('demo');*/

  }


  public downloadPDF(): void {
    const doc = new jsPDF();

    doc.text('REPORTE DE CONSULTAS', 65, 10);
    doc.save('hello-world.pdf');
  }



}
