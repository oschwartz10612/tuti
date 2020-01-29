import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable, of  } from 'rxjs';
import { SpotifyService } from "../spotify.service";

@Component({
  selector: 'app-play',
  templateUrl: './play.component.html',
  styleUrls: ['./play.component.css']
})
export class PlayComponent implements OnInit {

  room$: Observable<any>;
  isLoaded: boolean = false;
  noRoom: boolean = false;

  searchResult$: Observable<any>

  constructor(private route: ActivatedRoute, private router: Router, private afs: AngularFirestore, private spotify: SpotifyService) { 
    let id = this.route.snapshot.paramMap.get('id');
    this.room$ = afs.collection(id).doc('room').valueChanges()
    this.room$.subscribe(room => {
      this.isLoaded = true
      if(room == undefined || room == null) {
        this.noRoom = true
      }
    })
  }
  

  ngOnInit() {

    
  }

  async searchNow(query) {
    this.searchResult$ = await this.spotify.search(query, 'track')
    this.searchResult$.subscribe(data => {
      console.log(data);
      
    })
  }

}
