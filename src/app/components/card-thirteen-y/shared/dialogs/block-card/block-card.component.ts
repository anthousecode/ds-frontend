import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-block-card',
  templateUrl: './block-card.component.html',
  styleUrls: ['./block-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BlockCardComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
