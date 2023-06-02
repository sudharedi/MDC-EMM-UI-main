import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-base',
  template: `
  <h1>hello</h1>`,
  styleUrls: []
})
export class BaseComponent implements OnInit, OnDestroy {
  public subscribers: any[] = [];

  constructor() { }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.subscribers.forEach(subscriber => {
      subscriber.unsubscribe();
    });
  }
}
