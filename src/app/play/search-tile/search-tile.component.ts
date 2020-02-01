import { Component, OnInit, Input } from '@angular/core';
import { SpotifyService } from 'src/app/spotify.service';

@Component({
  selector: 'app-search-tile',
  templateUrl: './search-tile.component.html',
  styleUrls: ['./search-tile.component.css']
})

export class SearchTileComponent implements OnInit {

  @Input() url: string;
  @Input() name: string;
  @Input() trackId: string;

  constructor(private spotify: SpotifyService) { }

  ngOnInit() {

  }

  addTrack() {
    this.spotify.addTrack(this.trackId)
  }

}
