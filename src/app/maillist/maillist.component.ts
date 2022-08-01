import { Component, HostListener, OnInit } from '@angular/core';
import { fromEvent, Observable, Subscription } from "rxjs";

@Component({
  selector: 'app-maillist',
  templateUrl: './maillist.component.html',
  styleUrls: ['./maillist.component.scss']
})
export class MaillistComponent implements OnInit {

  sidebar_margin = 160;
  timestamp_margin = 50;
  resizeObservable$!: Observable<Event>;
  resizeSubscription$!: Subscription;
  mailwidth = window.innerWidth - this.sidebar_margin;
  messagewidth = this.mailwidth - this.timestamp_margin;

  constructor() { }

  ngOnInit(): void {
    this.resizeObservable$ = fromEvent(window, 'resize')
    this.resizeSubscription$ = this.resizeObservable$.subscribe( evt => {
      this.mailwidth = window.innerWidth - this.sidebar_margin;
      this.messagewidth = this.mailwidth - this.timestamp_margin;
    })
  }

  ngOnDestroy() {
    this.resizeSubscription$.unsubscribe()
  }

}
