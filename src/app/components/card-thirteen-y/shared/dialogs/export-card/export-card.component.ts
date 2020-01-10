import {Component, OnInit, ChangeDetectionStrategy} from '@angular/core';
import {FormControl, Validators} from '@angular/forms';
import {CardThirteenYService} from '../../../card-thirteen-y.service';
import * as FileSaver from 'file-saver';

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

    constructor(private cardThirteenYService: CardThirteenYService) {
    }

    ngOnInit() {
        this.exportControl = new FormControl('', [Validators.required]);
    }

    downloadCard() {
        const selectedFormat = this.exportControl.value;
        this.cardThirteenYService.exportCard(selectedFormat)
            .subscribe(file => FileSaver.saveAs(file, 'card-13.' + selectedFormat));
    }
}
