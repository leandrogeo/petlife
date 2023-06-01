import { Component } from '@angular/core';
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
  ConectadosSi = false;
  IDconectado: string;
  constructor(
    public firebaseauthService: FirebaseauthService,
    private router: Router,
    private platform: Platform,
    public firestoreService: FirestoreService,
  ) {
    this.initializeApp();
  }
  Isadmin:boolean

  initializeApp() {
    this.platform.ready().then(() => {
      // this.statusbar.styleDefault();
      // this.splashScreen.hide();
      this.getUid();
    })
  }

  async getUid() {
    await this.firebaseauthService.stateAuth().subscribe(res => {
      if (res !== null) {
        this.ConectadosSi = true;
        this.IDconectado = res.uid
        console.log(this.IDconectado)
        this.getadmin(this.IDconectado)
        //this.comparar(this.IDconectado)
      } else {
        this.ConectadosSi = false;
      }
    });
  }

  onClick() {
    this.firebaseauthService.logout();
    this.router.navigate(['/perfil']);
  }

  async getadmin(uid: string) {
    await this.firestoreService.getCollection<Admins>('Admins').subscribe(res => {
      this.admin = res;
      const resultado =  this.admin.filter(item => item.idusu == uid);
      if (resultado.length) {
        this.Isadmin=true
        return true
      } else {
        this.Isadmin=false
        return false
      }
    });
  }
  

/*
  async comparar(Idconectado) {
    const resultado = await this.admin.filter(item => item.idusu == Idconectado);
    console.log('this.admin get comparar '+ this.admin)
    if (resultado.length) {
      this.Isadmin=true
      //console.log('Isadmins '+ this.Isadmin)
      return true
    } else {
      this.Isadmin=false
      //console.log('Isadmins '+ this.Isadmin)
      return false
    }
    
  }*/
}
