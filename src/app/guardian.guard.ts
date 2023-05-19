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

  admin: Admins[] = [];
  prueba: boolean
  siesadmins = false;
  usuariouid: string

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    // this.prueba = this.getadmin(this.appcomponent.pasarinfo());
    console.log('preiba ' + this.prueba)
    return true;
  }


}
