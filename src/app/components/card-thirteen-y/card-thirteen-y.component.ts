import { Component, OnInit, ChangeDetectionStrategy, Inject, ChangeDetectorRef } from '@angular/core';
import { ICardThirteenYMenu } from './shared/interfaces/card-thirteen-y-menu.interface';
import { CARD_THIRTEEN_Y_MENU } from './shared/data/card-thirteen-y-menu';
import { trigger, style, animate, transition } from '@angular/animations';
import { EventManager } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';
import { MatDialog, MatSnackBar } from '@angular/material';
import { AdditionalInformationComponent } from './additional-information/additional-information.component';
import { ChangesHistoryComponent } from './shared/dialogs/changes-history/changes-history.component';
import { ExportCardComponent } from './shared/dialogs/export-card/export-card.component';
import { CardThirteenYService } from './card-thirteen-y.service';
import { SaveConfirmComponent } from './shared/dialogs/save-confirm/save-confirm.component';
import { AbstractControl } from '@angular/forms';
import { TokenService } from '../../@core/shared/services/token.service';
import { CardService } from '../../@core/shared/services/card.service';
import {TOKEN} from './shared/data/token';
import {DoneCardComponent} from "./shared/dialogs/done-card/done-card.component";
import {BlockCardComponent} from "./shared/dialogs/block-card/block-card.component";

@Component({
  selector: 'app-card-thirteen-y',
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({opacity: 0}),
        animate(200, style({opacity: 1}))
      ]),
      transition(':leave', [
        animate(200, style({opacity: 0}))
      ])
    ])
  ],
  templateUrl: './card-thirteen-y.component.html',
  styleUrls: ['./card-thirteen-y.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CardThirteenYComponent implements OnInit {
  menuItems: ICardThirteenYMenu[] = CARD_THIRTEEN_Y_MENU;
  activeTabKey: string;
  isAdditionalInfoVisible = false;
  private innerWidth!: number;
  activeTabInitValues!: AbstractControl;
  activeTabInitValuesModified!: string;
  activeTabCurrentValues!: AbstractControl;
  activeTabCurrentValuesModified!: string;
  cardId = 696;
  cardInfo!: any;
  token = TOKEN;

  constructor(@Inject(DOCUMENT) private document: Document,
              private cardThirteenYService: CardThirteenYService,
              private tokenService: TokenService,
              private dialog: MatDialog,
              private snackBar: MatSnackBar,
              private cardService: CardService,
              private cdRef: ChangeDetectorRef,
              private eventManager: EventManager) {
    this.cardThirteenYService.getCardInfo(this.cardId).subscribe(data => {
      this.cardInfo = data;
    });
    this.eventManager.addGlobalEventListener('window', 'resize', () => {
      this.innerWidth = this.document.body.offsetWidth;
      if (this.innerWidth <= 1300) {
        this.isAdditionalInfoVisible = false;
        this.cdRef.detectChanges();
      }
    });
  }

  ngOnInit() {
    localStorage.setItem('token', this.token);
    this.innerWidth = this.document.body.offsetWidth;
    this.checkActiveTab();
    this.checkActiveTabInitValues();
    this.checkActiveTabCurrentValues();
  }

  checkActiveTab() {
    this.cardThirteenYService.activeTab.subscribe(key => {
      this.activeTabKey = key;
      this.cdRef.markForCheck();
    });
  }

  checkActiveTabInitValues() {
    this.cardThirteenYService.activeTabInitValues.subscribe(data => {
      this.activeTabInitValues = data;
      this.activeTabInitValuesModified = JSON.stringify(data);
      this.cdRef.detectChanges();
    });
  }

  checkActiveTabCurrentValues() {
    this.cardThirteenYService.activeTabCurrentValues.subscribe(data => {
      if (data) {
        this.activeTabCurrentValues = data;
        this.activeTabCurrentValuesModified = JSON.stringify(data);
      } else {
        this.activeTabCurrentValues = null;
      }
      this.cdRef.detectChanges();
    });
  }

  changeTab(tabKey: string) {
    if (tabKey !== this.activeTabKey) {
      if ((JSON.stringify(this.activeTabInitValues) === JSON.stringify(this.activeTabCurrentValues)) || !this.activeTabCurrentValues) {
        this.cardThirteenYService.setActiveTab(tabKey);
      } else {
        this.dialog.open(SaveConfirmComponent, {panelClass: '__save-confirm'}).afterClosed()
          .subscribe(() => {
            this.cardThirteenYService.setActiveTab(tabKey);
          });
      }
    }
  }

  openChangesHistory() {
    this.dialog.open(ChangesHistoryComponent, {panelClass: '__changes-history'});
  }

  toggleAdditionalInfo() {
    if (this.innerWidth > 1300) {
      this.isAdditionalInfoVisible = !this.isAdditionalInfoVisible;
    } else {
      this.dialog.open(AdditionalInformationComponent, {panelClass: '__additional-dialog'});
    }
  }

  saveCard() {
    this.cardThirteenYService.setTabInitValues(this.activeTabCurrentValues);
    this.snackBar.open('Сохранено', 'ОК', {
      duration: 5000
    });
  }

  exportCard() {
    this.dialog.open(ExportCardComponent, {panelClass: '__export-card'});
  }

  doneCard() {
    this.dialog.open(DoneCardComponent, {panelClass: '__done-card'});
  }

  blockCard() {
    this.dialog.open(BlockCardComponent, {panelClass: '__block-card'});
  }
}
