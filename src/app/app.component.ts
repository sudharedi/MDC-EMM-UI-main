import { Component } from '@angular/core';
import { Router, Event, NavigationStart, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  Router;
  showNavbar = false;
  showSidebar = false;

  constructor(private router: Router, private route: ActivatedRoute) {
    this.Router = router;
    this.Router.events.forEach((event) => {
      if (event instanceof NavigationStart) {
        if ((event['url'] === '/') || (event['url'] === '/login') || event['url'].indexOf('/?code') >= 0) {
          this.showNavbar = false;
          this.showSidebar = false;
        } else {
          this.showNavbar = true;
          this.showSidebar = true;
        }
      }
    });
  }
}
