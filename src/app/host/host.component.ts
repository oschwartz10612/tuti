import { Component, OnInit } from '@angular/core';
import { AuthService } from "../auth.service";
import { Observable } from "rxjs";

declare var Sentencer: any;

@Component({
  selector: 'app-host',
  templateUrl: './host.component.html',
  styleUrls: ['./host.component.css']
})
export class HostComponent implements OnInit {

  isLoaded: boolean = false

  constructor(private auth: AuthService) { 
    auth.user$.subscribe(()=> this.isLoaded = true )
  }

  ngOnInit() {

  } 

  login() {
    this.auth.login()
  }  

  logout() {
    this.auth.logout()
  }

  makeid(length) {
    var result           = '';
    var characters       = 'abcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
 }

}

