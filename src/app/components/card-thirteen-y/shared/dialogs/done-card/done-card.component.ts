import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import {CardThirteenYService} from '../../../card-thirteen-y.service';
import {MatDialogRef, MatSnackBar} from '@angular/material';
import {IdName} from '../../interfaces/id-name.interface';

@Component({
  selector: 'app-done-card',
  templateUrl: './done-card.component.html',
  styleUrls: ['./done-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DoneCardComponent {
  doneParams = {id: 2};

  constructor(private cardThirteenYService: CardThirteenYService,
              private snackBar: MatSnackBar,
              private matDialogRef: MatDialogRef<DoneCardComponent>) { }

  doneCard() {
    this.cardThirteenYService.setCardStatus(this.doneParams).subscribe((data: IdName) => {
      this.cardThirteenYService.checkCardStatus(data.id);
      this.cardThirteenYService.setBlockedMode(true);
      this.matDialogRef.close();
      this.snackBar.open('Обследование выполнено', 'ОК', {duration: 5000});
    });
  }
}
