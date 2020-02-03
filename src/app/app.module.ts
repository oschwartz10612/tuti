import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { JoinComponent } from './join/join.component';
import { PlayComponent } from './play/play.component';
import { SpotifyCallbackComponent } from './spotify-callback/spotify-callback.component';
import { SearchTileComponent } from './play/search-tile/search-tile.component';

import { environment } from '../environments/environment';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from "@angular/fire/auth";
import { AngularFirestoreModule } from "@angular/fire/firestore";
import { AngularFireFunctionsModule, FUNCTIONS_ORIGIN } from "@angular/fire/functions";
import { HttpClientModule, HttpClient } from "@angular/common/http";
import { HostComponent } from './host/host.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatButtonModule} from '@angular/material/button';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatCardModule} from '@angular/material/card';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatIconModule} from '@angular/material/icon';
import {MatSnackBarModule} from '@angular/material/snack-bar';


@NgModule({
  declarations: [
    AppComponent,
    SpotifyCallbackComponent,
    HostComponent,
    JoinComponent,
    PlayComponent,
    SearchTileComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    AngularFireFunctionsModule,
    AngularFirestoreModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatGridListModule,
    MatIconModule,
    MatSnackBarModule
  ],
  providers: [{ provide: FUNCTIONS_ORIGIN, useValue: 'http://localhost:5000' }],
  bootstrap: [AppComponent]
})
export class AppModule { }
