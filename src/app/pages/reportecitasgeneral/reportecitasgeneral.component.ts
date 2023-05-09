import { Component, OnInit } from '@angular/core';
import { Citas } from 'src/app/models';
import { FirestoreService } from 'src/app/services/firestore.service';

@Component({
  selector: 'app-reportecitasgeneral',
  templateUrl: './reportecitasgeneral.component.html',
  styleUrls: ['./reportecitasgeneral.component.scss'],
})
export class ReportecitasgeneralComponent implements OnInit {

  constructor(
    public firestoreservice: FirestoreService,
  ) { }
  desde: string;
  hasta: string;
  Citas: Citas[] = [];
  ngOnInit(

  ) { }

  generarpdf() {
    console.log('desde ' + this.desde)
    console.log('hasta ' + this.hasta)

    const path = 'Citas';
    this.firestoreservice.getCollectioncitasreporte<Citas>(path,'fecha_cita','>=',this.desde).subscribe(res => {
      this.Citas = res;
      console.log("si 1")
      console.log(this.Citas)
    })
  }
  pdfSrc = "https://vadimdez.github.io/ng2-pdf-viewer/assets/pdf-test.pdf";

}
