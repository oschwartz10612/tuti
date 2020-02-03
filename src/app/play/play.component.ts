import { Component, OnInit, HostListener } from '@angular/core';
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
  allowExplicit: boolean = false;
  numCols: number = 2
  searchResult$: Observable<any>

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.calcCols(window.innerWidth);
  }

  constructor(private route: ActivatedRoute, private router: Router, private afs: AngularFirestore, private spotify: SpotifyService) { 
    let id = this.route.snapshot.paramMap.get('id');
    spotify.roomId = id
    
    this.room$ = afs.doc(`rooms/${id}`).valueChanges()
    this.room$.subscribe(room => {
      this.isLoaded = true
      if(room == undefined || room == null) {
        this.noRoom = true
      }
    })
  }
  
  ngOnInit() {
    this.calcCols(window.innerWidth)
  }

  async searchNow(query) {
    this.searchResult$ = await this.spotify.search(query, 'track')
    this.searchResult$.subscribe(data => {
      console.log(data);
      
    })
  }

  calcCols(width) {
    var expectedCols = Math.round(width/160) - 2;
    if (expectedCols <= 2) {
      this.numCols = 2;
    } else {
      this.numCols = expectedCols;
    }
  }

}
