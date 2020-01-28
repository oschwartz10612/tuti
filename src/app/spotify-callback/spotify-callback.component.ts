import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from "../auth.service";

@Component({
  selector: 'app-spotify-callback',
  templateUrl: './spotify-callback.component.html',
  styleUrls: ['./spotify-callback.component.css']
})
export class SpotifyCallbackComponent implements OnInit {

  constructor(private route: ActivatedRoute, private auth: AuthService) { }

  ngOnInit() {

    this.route.queryParams.subscribe(params => {
     this.auth.handelCallback(params['code'])
    });
    
  }

}
