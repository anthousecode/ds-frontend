import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-export-modal',
  templateUrl: './export-modal.component.html',
  styleUrls: ['./export-modal.component.sass']
})
export class ExportModalComponent implements OnInit {
  selected = '1';
  constructor() { }

  ngOnInit() {
  }

}
