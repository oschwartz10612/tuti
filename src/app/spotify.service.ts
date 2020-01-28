import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class SpotifyService {

  rootURL: 'test'

  constructor(private http: HttpClient) { }
}
