import {Component, OnInit, ChangeDetectionStrategy} from '@angular/core';
import {FormControl} from '@angular/forms';

@Component({
  selector: 'app-export-card',
  templateUrl: './export-card.component.html',
  styleUrls: ['./export-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExportCardComponent implements OnInit {
  exportControl!: FormControl;
  exportCardData: string[] = [
    'xlsx',
    'xls',
    'xml'
  ];

  ngOnInit() {
    this.exportControl = new FormControl('');
  }

  downloadCard() {
    console.log('DOWNLOAD CARD');
  }
}
