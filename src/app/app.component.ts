import { Component} from '@angular/core';
import { FirebaseauthService } from './services/firebaseauth.service';
import { Router } from '@angular/router'
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})

export class AppComponent {

  admin = false;
  ConectadosSi= false;

  constructor(
    public firebaseauthService: FirebaseauthService,
    private router: Router,
    private platform: Platform,
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
        console.log("esta alguien conectado")
        if (res.uid === 'uMu7JLjPs9VrhcukNKTDm41yfuM2' 
        ) {
          this.admin = true;
        } else {
          this.admin = false;
        }
      } else {
        this.ConectadosSi=false; 
        this.admin = false;
      }
    });
  }
  onClick(){
    this.firebaseauthService.logout();
    this.router.navigate(['/perfil']);
  }





}
