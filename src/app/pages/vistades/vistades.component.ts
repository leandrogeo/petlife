import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Desp } from 'src/app/models';
import { FirestoreService } from 'src/app/services/firestore.service';
import html2canvas from 'html2canvas';
import pdfMake from "pdfmake/build/pdfmake";
import { Vacunas } from '../../models';


@Component({
  selector: 'app-vistades',
  templateUrl: './vistades.component.html',
  styleUrls: ['./vistades.component.scss'],
})
export class VistadesComponent implements OnInit, AfterViewInit {

  constructor(
    private activateroute: ActivatedRoute,
    public firestoreservice: FirestoreService
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

  ngOnInit() {
    this.uid = this.activateroute.snapshot.paramMap.get('uid')
    this.idmascota = this.activateroute.snapshot.paramMap.get('idmas')
    this.iddes = this.activateroute.snapshot.paramMap.get('iddes')
    this.getdespa();
  }



  getdespa() {
    const path = 'Usuarios/' + this.uid + '/Mascotas/' + this.idmascota + '/Desparacitacion/';
    this.firestoreservice.getDoc<Desp>(path, this.iddes).subscribe(res => {
      if (res !== undefined) {
        this.despa = res;
      }
    });
  }


  pdf() {

    try {
      const cardElement = document.getElementById('myCard')
      html2canvas(cardElement).then(canvas => {
        // Convierte el lienzo capturado a una imagen en base64
        const base64Image = canvas.toDataURL();

        // Imprime la representación en base64 de la imagen en la consola
        // console.log(base64Image);

        // Puedes utilizar la imagen en base64 como desees, por ejemplo, asignarla a una variable en tu componente o mostrarla en una etiqueta de imagen en tu HTML.
        // Ejemplo: Asignarla a una variable en el componente
        this.base64Image = base64Image;
      });
      const docDef = {
        pageSize: 'A4',
        pageOrientation: 'portait',
        pageMargins: [20, 10, 40, 60],
        content: [
          {
            image: this.base64Image,
            width: 600,
            height: 500,
            alignment: 'center',
          },
        ],
      }

      this.pdfObj = pdfMake.createPdf(docDef);
      this.pdfObj.download('Desparacitacion: ' + this.despa.id_des);


    } catch (error) {
      alert(error)
    }


    /*const directory = this.file.externalDataDirectory;

    console.log('Directorio de almacenamiento:', directory);
    const cardElement = document.getElementById('id-del-ion-card'); // Reemplaza 'id-del-ion-card' con el ID real de tu ion-card

    html2canvas(cardElement).then(canvas => {
      const imageData = canvas.toDataURL();

      // Obtén el directorio de almacenamiento adecuado según la plataforma
      const directory = this.file.externalDataDirectory; // Para Android

      // Genera un nombre de archivo único
      const fileName = 'imagen_capturada.png';

      // Escribe la imagen en el archivo local
      this.file.writeFile(directory, fileName, imageData, { replace: true })
        .then(() => {
          console.log('Imagen guardada exitosamente.');
        })
        .catch(err => {
          console.error('Error al guardar la imagen:', err);
        });
    });*/

  }

  ngAfterViewInit() {
    /*const cardElement = document.getElementById('myCard');
    const cardContent = cardElement.innerHTML;

    // Imprime el contenido del ion-card en la consola
    console.log(cardContent);

    // Crea un nuevo elemento y establece el contenido del ion-card capturado
    const newCardElement = document.createElement('div');
    newCardElement.innerHTML = cardContent;

    // Agrega el nuevo elemento al DOM
    const containerElement = document.getElementById('container');
    containerElement.appendChild(newCardElement);
*/
  }




}
