import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { FirestoreService } from './firestore.service';


@Injectable({
  providedIn: 'root'
})

export class FirebaseauthService {


  //datosCliente: Cliente;

  constructor(
    public auth: AngularFireAuth,
    private firestoreService: FirestoreService) {

    //this.stateUser();
    this.getUid();
  }


  /*stateUser() {
    this.stateAuth().subscribe( res => {
      // console.log(res);
      if (res !== null) {
         this.getInfoUser();

      }  
   });

  }*/

  async restablecercontra(email: string) {
    try {
      return this.auth.sendPasswordResetEmail(email);

    } catch (error) {
      console.log('Error==>', error.message)
    }

  }

  login(email: string, password: string) {
    return this.auth.signInWithEmailAndPassword(email, password);
  }

  logout() {
    return this.auth.signOut();
  }

  registrar(email: string, password: string) {
    return this.auth.createUserWithEmailAndPassword(email, password);
  }

  async getUid() {
    const user = await this.auth.currentUser;
    if (user === null) {
      return null;
    } else {
      return user.uid;
    }
  }
  

  stateAuth() {
    return this.auth.authState;
  }

  /*
    async getInfoUser() {
        const uid = await this.getUid();
        const path = 'Clientes';  
        this.firestoreService.getDoc<Cliente>(path, uid).subscribe( res => {
              if (res !== undefined) {
                    this.datosCliente = res;
                    // console.log('datosCliente ->' , this.datosCliente);
              }
        });
    }*/


}
