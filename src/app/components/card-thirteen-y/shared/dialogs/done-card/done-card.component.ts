import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-done-card',
  templateUrl: './done-card.component.html',
  styleUrls: ['./done-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DoneCardComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
