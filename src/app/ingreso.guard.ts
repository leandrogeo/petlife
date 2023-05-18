import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { Usuario } from './models';
import { FirebaseauthService } from './services/firebaseauth.service';
import { FirestoreService } from './services/firestore.service';

@Injectable({
  providedIn: 'root'
})
export class IngresoGuard implements CanActivate {

  uid = '';
  suscriberUserInfo: Subscription;
  usuario: Usuario = {
    uid: '',
    correo: '',
    contrasenia: '',
    celular: '',
    direccion: '',
    nombre: '',
    admin: false,
  };

  admin = false;
  constructor(
    public firebaseauthService: FirebaseauthService,
    public firestoreservice: FirestoreService) 
    {
    this.firebaseauthService.stateAuth().subscribe(res => {
      if (res !== null) {
        this.uid = res.uid;
        this.getUserInfo(this.uid);
      } else {

      }
    });

  }

  getUserInfo(uid: string) {
    const path = 'Usuarios';
    this.suscriberUserInfo = this.firestoreservice.getDoc<Usuario>(path, uid).subscribe(res => {
      if (res !== undefined) {
        this.usuario = res;
      }
    });
  }


  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (this.usuario.admin === true) {
      this.admin = true;
    }
    return this.admin;
  }

}
