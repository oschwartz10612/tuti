import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from "@angular/common/http";
import { environment } from "../environments/environment";
import { AngularFireFunctions } from '@angular/fire/functions';
import { TokenizeResult } from '@angular/compiler/src/ml_parser/lexer';

@Injectable({
  providedIn: 'root'
})

export class SpotifyService {

  constructor(private http: HttpClient, private fns: AngularFireFunctions) { }

   async search(query, type: 'album' | 'artist' | 'playlist' | 'track') {
    const token = await this.getApiToken()
    console.log(token);

    let headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    let params = new HttpParams().set('q', query).set('type', type);

    return this.http.get('https://api.spotify.com/v1/search', {headers, params});
  }

  async getApiToken() {
      const token = await this.fns.httpsCallable('getApiToken')({}).toPromise();
      return token.access_token;
  }
}
