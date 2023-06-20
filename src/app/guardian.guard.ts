import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { FirestoreService } from './services/firestore.service';
import { Admins, Usuario } from './models';
import { FirebaseauthService } from './services/firebaseauth.service';
import { AppComponent } from './app.component';

@Injectable({
  providedIn: 'root'
})
export class GuardianGuard implements CanActivate {
  constructor(
    public firestoreService: FirestoreService,
    public firebaseauthService: FirebaseauthService,
    public appcomponent: AppComponent) {

  }
  canActivate(): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    //this.prueba = this.getadmin(this.appcomponent.pasarinfo());
    this.getUid();
    console.log(this.Isadmin)
    return this.Isadmin;
  }
  admin: Admins[] = [];

  IDconectado: string;
  Isadmin: any

  async getUid() {
    await this.firebaseauthService.stateAuth().subscribe(res => {
      if (res !== null) {
        this.IDconectado = res.uid
        console.log(this.IDconectado)
        this.getadmin(this.IDconectado)
        //this.comparar(this.IDconectado)
      } else {
      }
    });
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

}
