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
    public firestoreservice: FirestoreService) {
  }

  
  //OBETENGO LA INFORMACION DEL USUARIO CONECTADO
  getUserInfo(uid: string, route: ActivatedRouteSnapshot): boolean {
    const path = 'Usuarios';
    this.firestoreservice.getDoc<Usuario>(path, uid).subscribe(res => {
      if (res !== undefined) {
        console.log(res)
        this.usuario = res;
        this.admin = res.admin
        console.log(this.admin)
      } else {
        console.log('nadaaaaa')
      }
    });
    console.log(this.usuario.admin + ' === ' + route.data['role'])
    if (this.usuario.admin = true) {
      console.log('nSI ES ADMIN')
      return true;
    } else {
      console.log('no tiene acceso')
      return false
    }
  }


  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    this.firebaseauthService.stateAuth().subscribe(res => {
      if (res !== null) {
        this.uid = res.uid
        
        return true;
      } else {
        console.log('nadie conectado')
        return false;
      }
    });
    return this.getUserInfo(this.uid, route);

  }

}
