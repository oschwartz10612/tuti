import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SpotifyCallbackComponent } from "./spotify-callback/spotify-callback.component";
import { HostComponent } from "./host/host.component";
import { AppComponent } from "./app.component";
import { JoinComponent } from "./join/join.component";
import { PlayComponent } from "./play/play.component";

const routes: Routes = [
  {path: 'callback', component: SpotifyCallbackComponent},
  {path: 'host', component: HostComponent},
  {path: 'join', component: JoinComponent},
  {path: 'play/:id', component: PlayComponent},
  {path: 'play', component: JoinComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
