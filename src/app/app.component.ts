import { Component } from '@angular/core';
import { FirebaseauthService } from './services/firebaseauth.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})


export class AppComponent {

  admin = false;


  constructor(
    public firebaseauthService: FirebaseauthService,

  ) { 
    this.getUid();
  }

  getUid() {
    this.firebaseauthService.stateAuth().subscribe(res => {
      if (res !== null) {
        if (res.uid === 'uMu7JLjPs9VrhcukNKTDm41yfuM2' 
        ) {
          this.admin = true;
        } else {
          this.admin = false;
        }
      } else {
        this.admin = false;
      }
    });
  }





}
