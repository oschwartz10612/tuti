import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireFunctions } from '@angular/fire/functions';
import { AngularFirestore } from '@angular/fire/firestore';
import { auth } from 'firebase/app';
import { environment } from "../environments/environment";
import { Observable, of } from 'rxjs';
import { Router } from '@angular/router';
import { switchMap } from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  user$: Observable<any>;
  userData = {
    uid: ''
  }

  constructor(private afAuth: AngularFireAuth, private fns: AngularFireFunctions, private afs: AngularFirestore, private router: Router) {
    this.user$ = afAuth.authState.pipe(
      switchMap(user => {
        if (user) {
          if (user.isAnonymous) {
            return afs.doc(`anonUsers/${user.uid}`).valueChanges();
          } else {
            return afs.doc(`users/${user.uid}`).valueChanges();
          }
        } else {
          return of(null);
        }
      })
    );

    this.user$.subscribe(user => {
      console.log(user);
      this.userData.uid = user.uid
    })
  }

  login() {
    const url = this.getLoginURL(['user-read-private', 'user-read-email', 'playlist-read-collaborative', 'playlist-modify-private', 'playlist-modify-public', 'playlist-read-private', 'user-read-playback-state', 'user-read-currently-playing', 'user-modify-playback-state', 'streaming', 'app-remote-control']);
    window.open(url, '_self');
  }

  async handelCallback(authCode) {
    const account = await this.fns.httpsCallable('createFirebaseAccount')({ code: authCode }).toPromise();
    await this.afAuth.auth.signInWithCustomToken(account.token)
    this.router.navigate(['/host']);
  }

  logout() {
    this.afAuth.auth.signOut();
  }

  async loginAnon() {
    const userCredential = await this.afAuth.auth.signInAnonymously();
    await this.afs.doc(`anonUsers/${userCredential.user.uid}`).set({
      uid: userCredential.user.uid,
      remaining: 2
    })
  }

  getLoginURL(scopes) {
    return 'https://accounts.spotify.com/authorize?client_id=' + environment.spotify.clientId +
      '&redirect_uri=' + encodeURIComponent(environment.spotify.redirectUri) +
      '&scope=' + encodeURIComponent(scopes.join(' ')) +
      '&response_type=code';
  }

}


