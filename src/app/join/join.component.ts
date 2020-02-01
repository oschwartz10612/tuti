import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { AuthService } from '../auth.service';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-join',
  templateUrl: './join.component.html',
  styleUrls: ['./join.component.css']
})
export class JoinComponent implements OnInit {
  
  enterData: boolean = false;
  noRoom: boolean = false;

  constructor(private route: ActivatedRoute, private router: Router, private auth: AuthService, private afs: AngularFirestore) { }

  ngOnInit() {
    
  }

  async joinTuti(tutiId) {
    if (tutiId != null && tutiId != '') {

      const snapshot = await this.afs.doc(`rooms/${tutiId}`).get().toPromise()
      if (snapshot.exists) {
        await this.auth.loginAnon()
        this.router.navigate(['/play', tutiId]);
      } else {
        this.noRoom = true
        setTimeout(() => {
          this.noRoom = false;
        }, 5000)
      }

    } else {
      this.enterData = true
      setTimeout(() => {
        this.enterData = false;
      }, 5000)
    }
  }

}
