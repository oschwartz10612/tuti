import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

@Component({
  selector: 'app-join',
  templateUrl: './join.component.html',
  styleUrls: ['./join.component.css']
})
export class JoinComponent implements OnInit {
  
  enterData: boolean = false;

  constructor(private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    
  }

  joinTuti(tutiId) {
    if (tutiId != null && tutiId != '') {
      this.router.navigate(['/play', tutiId]);
    } else {
      this.enterData = true
      setTimeout(() => {
        this.enterData = false;
      }, 5000)
    }
  }

}
