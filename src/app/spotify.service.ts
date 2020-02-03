import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from "@angular/common/http";
import { AngularFireFunctions } from '@angular/fire/functions';
import { AngularFirestore } from '@angular/fire/firestore';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})

export class SpotifyService {

  roomId: string

  constructor(private http: HttpClient, private fns: AngularFireFunctions, private afs: AngularFirestore, private auth: AuthService) { }

   async search(query, type: 'album' | 'artist' | 'playlist' | 'track') {
    const token = await this.getApiToken()

    let headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    let params = new HttpParams().set('q', query).set('type', type);

    return this.http.get('https://api.spotify.com/v1/search', {headers, params});
  }

  async getApiToken() {
      const token = await this.fns.httpsCallable('getApiToken')({}).toPromise();
      return token.access_token;
  }

  addTrack(trackUri) {
    this.fns.httpsCallable('addTrack')({ uri: trackUri, roomId: this.roomId })
  }
}
