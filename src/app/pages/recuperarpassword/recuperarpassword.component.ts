import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, ToastController } from '@ionic/angular';
import { FirebaseauthService } from 'src/app/services/firebaseauth.service';

@Component({
  selector: 'app-recuperarpassword',
  templateUrl: './recuperarpassword.component.html',
  styleUrls: ['./recuperarpassword.component.scss'],
})
export class RecuperarpasswordComponent  implements OnInit {

  constructor(
    public firebaseauthService: FirebaseauthService,
    private router: Router,
    public toastController: ToastController,
    private alertCtrl: AlertController) { }
  correo:string
  ngOnInit() {}


  async resetpassword(email){
    console.log('email',email.value);
    try {
      await this.firebaseauthService.restablecercontra(email.value);
      this.presentToast('Por favor revisa tu correo electronico en bandeja de entrada o spam');
      this.router.navigate(['/home']);
    } catch (error) {
    console.log('Error',error)
    const alert =  this.alertCtrl.create({
      //cssClass: 'my-custom-class',
      header: 'Fallo restablecer contrase;a',
      message: 'Usuario no existe',
      buttons: ['OK'] 
    });
 
     (await alert).present();
    
      
    }
  }

  async presentToast(msg: string) {
    const toast = await this.toastController.create({
      message: msg,
      cssClass: 'normal',
      duration: 2000,
      color: 'success',
    })
    toast.present();
  }
}
