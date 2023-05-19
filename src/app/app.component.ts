import { Component} from '@angular/core';
import { FirebaseauthService } from './services/firebaseauth.service';
import { Router } from '@angular/router'
import { Platform } from '@ionic/angular';
import { FirestoreService } from './services/firestore.service';
import { Admins } from './models';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})

export class AppComponent {

  admin: Admins[] = [];
  ConectadosSi= false;
  IDconectado:string;
  constructor(
    public firebaseauthService: FirebaseauthService,
    private router: Router,
    private platform: Platform,
    public firestoreService: FirestoreService,
  ) { 
    this.initializeApp();
  }


  initializeApp(){
    this.platform.ready().then(()=>{
      // this.statusbar.styleDefault();
      // this.splashScreen.hide();
      this.getUid();
    })
  }
 
  getUid() {
    this.firebaseauthService.stateAuth().subscribe(res => {
      if (res !== null) {
        this.ConectadosSi=true;
        this.IDconectado = res.uid
        console.log("re " +res.uid)
      } else {
        this.ConectadosSi=false; 
      }
    });
  }
  onClick(){
    this.firebaseauthService.logout();
    this.router.navigate(['/perfil']);
  }

  pasarinfo(){
    return this.IDconectado
  }

  getadmin(uid: string) {
    this.firestoreService.getCollection<Admins>('Admins').subscribe(res => {
      this.admin = res;
      console.log("this admisn")
      console.log(this.admin)
    });
    const resultado = this.admin.filter(item => item.idusu == uid);
      console.log(resultado)
      if (resultado.length) {
        return true
      } else {
        return false;
      }
  }
}
