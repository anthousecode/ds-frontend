import {Component, ChangeDetectionStrategy} from '@angular/core';
import {CardThirteenYService} from '../../../card-thirteen-y.service';
import {MatDialogRef, MatSnackBar} from '@angular/material';
import {IdName} from '../../interfaces/id-name.interface';

@Component({
    selector: 'app-block-card',
    templateUrl: './block-card.component.html',
    styleUrls: ['./block-card.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class BlockCardComponent {
    blockParams = {id: 4};

    constructor(private cardThirteenYService: CardThirteenYService,
                private snackBar: MatSnackBar,
                private matDialogRef: MatDialogRef<BlockCardComponent>) {
    }

    blockCard() {
        this.cardThirteenYService.setCardStatus(this.blockParams).subscribe((data: IdName) => {
            this.cardThirteenYService.checkCardStatus(data.id);
            this.cardThirteenYService.setBlockedMode(true);
            this.matDialogRef.close();
            this.snackBar.open('Карта обследования заблокирована', 'ОК', {duration: 5000});
        });
    }
}
