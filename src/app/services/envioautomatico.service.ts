import { Injectable } from '@angular/core';
import { FirestoreService } from './firestore.service';
import { Citas, Usuario } from '../models';
import { format, subDays } from 'date-fns';
import { DatePipe } from '@angular/common';
import { error } from 'console';
@Injectable({
  providedIn: 'root'
})
export class EnvioautomaticoService {
  citastotales: Citas[] = [];
  private ejecutadoHoy: boolean = false;
  usuario: Usuario = {
    uid: '',
    correo: '',
    contrasenia: '',
    celular: '',
    direccion: '',
    nombre: '',
    admin: false,
  }
  constructor(public firestoreservice: FirestoreService,
    private datePipe: DatePipe
  ) {
    this.getCitas()
  }

  startCronJob() {
    setInterval(() => {
      console.log('ASSSSSSSSSS')
      const fechaActual = new Date();
      const hora = fechaActual.getHours();
      const minutos = fechaActual.getMinutes();

      console.log('fecha actual ' + fechaActual)
      if (hora === hora && minutos === 30  && !this.ejecutadoHoy) { 
        this.citastotales.forEach((item, index) => {
          console.log('---------------------------------------------------------')
          this.ejecutarFuncion(this.citastotales[index].fecha_cita, this.citastotales[index].correousu, this.citastotales[index].nombreusu, this.citastotales[index].namepet, fechaActual);
          this.ejecutadoHoy = true;
          console.log(this.ejecutadoHoy)
        });
        // this.ejecutarFuncion(this.citastotales.fecha_cita[i]);
      } else {
        this.ejecutadoHoy = false;
        console.log(this.ejecutadoHoy)
        console.log('xxxxxxxxxxxxNO ES LA HORAxxxxxxxxxxxx ') // Reiniciar el estado si ya pasó la hora programada
      }
    }, 60000);
  }

  getCitas() {
    const path = 'Citas';
    this.firestoreservice.getCollectionCitas<Citas>(path).subscribe(res => {
      this.citastotales = res
    });
  }

  ejecutarFuncion(fechacita, correousu, nombreusu, nommascota, fechaactual) {

    // Supongamos que tienes una fecha en formato de cadena de texto
    // Restar un día utilizando la función subDays
    const fechaObjeto = new Date(fechacita);
    const fechaAnterior = subDays(fechaObjeto, 1);
    // Formatear la fecha anterior en el formato deseado
    const fechaAnteriorStr = format(fechaAnterior, 'yyyy-MM-dd');
    const fechaactual1 = format(fechaactual, 'yyyy-MM-dd')
    console.log(fechaAnteriorStr);
    console.log(fechaactual1)
    console.log(correousu+' '+ nombreusu+' ' +fechacita)
    if(fechaactual1 === fechaAnteriorStr){
      console.log('corre ' + correousu)
      const correo = {
        to: correousu,
        message: {
          text: 'Registro exitoso!',
          subject: 'Registro de cita para la mascota ' + nommascota,
          html: '<html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Cita médica para tu mascota</title></head><body> <div style="max-width: 600px; margin: 0 auto;"> <img src="https://scontent.fuio35-1.fna.fbcdn.net/v/t39.30808-6/225807018_137143835221353_3574420849320651821_n.jpg?_nc_cat=101&ccb=1-7&_nc_sid=09cbfe&_nc_eui2=AeEjR56AnSqaB_r7XsFv8ZU2wp2iJA4iDuLCnaIkDiIO4qcbpuXH4tABcoyirtQZ5gXndyDQFjlVmMgxxuzbTbpE&_nc_ohc=mn_nF2zFKqQAX9duWnt&_nc_ht=scontent.fuio35-1.fna&oh=00_AfBXOSmUP2sdTtKNB1-k4LW41jY2b9N7PQ5T7zcoBJHuZw&oe=648A7F8C" alt="Logo de la clínica veterinaria" style="max-width: 200px;"> <h1>Cita médica para tu mascota</h1> <p>Estimado/a'+nombreusu.toUpperCase()+',</p> <p>Te recordamos que tienenes agendada una cita médica para tu mascota: '+nommascota.toUpperCase()+'</p><h2>Detalles de la cita:</h2><ul><li><strong>Mascota: </strong> '+nommascota.toUpperCase()+'</li><li><strong>Fecha: </strong>'+ this.datePipe.transform(fechacita, 'dd/MM/yyyy')+'</li><li><strong>Hora: </strong>'+ this.datePipe.transform(fechacita, 'HH:mm')+'</li></ul><p>Por favor, asegúrate de llegar a tiempo!</p><p>Si necesitas cancelar o reprogramar la cita, te pedimos que nos contactes lo antes posible.</p><p>¡Esperamos verte pronto!</p><p>Atentamente,</p><p>PETLIFE</p></div></body></html>',
        }
      };
      this.firestoreservice.createDoc(correo, 'mail', this.firestoreservice.getId()).then(res => {
      console.log('correo enviado')
    }).catch(error => {
      console.log('correo no enviado'+error)
    });
      console.log(correo)
    }else{
      console.log('NO SE ENVIA CORREO')
    }
    
    
    
  }
}
