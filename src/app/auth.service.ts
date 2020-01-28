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

  constructor(private afAuth: AngularFireAuth, private fns: AngularFireFunctions, private afs: AngularFirestore, private router: Router) {
    this.user$ = afAuth.authState.pipe(
      switchMap(user => {
        if (user) {
          return afs.doc(`users/${user.uid}`).valueChanges();
        } else {
          return of(null);
        }
      })
    );
  }

  login() {
    const url = this.getLoginURL(['user-read-private', 'user-read-email', 'playlist-read-collaborative', 'playlist-modify-private', 'playlist-modify-public', 'playlist-read-private', 'user-read-playback-state', 'user-read-currently-playing', 'user-modify-playback-state', 'streaming', 'app-remote-control']);
    window.open(url, '_self');
  }

  async handelCallback(authCode) {
    const account = await this.fns.httpsCallable('createFirebaseAccount')({ code: authCode }).toPromise();
    this.afAuth.auth.signInWithCustomToken(account.token)
    this.router.navigate(['/host']);
  }

  logout() {
    this.afAuth.auth.signOut();
  }

  async getTokens(uid) {
    return await this.afs.collection('spotifyTokens').doc(uid).get().toPromise()
  }

  getLoginURL(scopes) {
    return 'https://accounts.spotify.com/authorize?client_id=' + environment.spotify.clientId +
      '&redirect_uri=' + encodeURIComponent(environment.spotify.redirectUri) +
      '&scope=' + encodeURIComponent(scopes.join(' ')) +
      '&response_type=code';
  }

}


