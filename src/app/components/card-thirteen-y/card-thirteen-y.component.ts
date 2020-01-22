import {Component, OnInit, ChangeDetectionStrategy, Inject, ChangeDetectorRef, Self} from '@angular/core';
import {ICardThirteenYMenu} from './shared/interfaces/card-thirteen-y-menu.interface';
import {CARD_THIRTEEN_Y_MENU} from './shared/data/card-thirteen-y-menu';
import {trigger, style, animate, transition} from '@angular/animations';
import {EventManager} from '@angular/platform-browser';
import {DOCUMENT} from '@angular/common';
import {MatDialog, MatSnackBar} from '@angular/material';
import {AdditionalInformationComponent} from './additional-information/additional-information.component';
import {ChangesHistoryComponent} from './shared/dialogs/changes-history/changes-history.component';
import {ExportCardComponent} from './shared/dialogs/export-card/export-card.component';
import {CardThirteenYService} from './card-thirteen-y.service';
import {SaveConfirmComponent} from './shared/dialogs/save-confirm/save-confirm.component';
import {AbstractControl} from '@angular/forms';
import {TokenService} from '../../@core/shared/services/token.service';
import {CardService} from '../../@core/shared/services/card.service';
import {TOKEN} from './shared/data/token';
import {DoneCardComponent} from './shared/dialogs/done-card/done-card.component';
import {BlockCardComponent} from './shared/dialogs/block-card/block-card.component';
import {skip, takeUntil} from 'rxjs/operators';
import {NgOnDestroy} from '../../@core/shared/services/destroy.service';

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
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [NgOnDestroy]
})
export class CardThirteenYComponent implements OnInit {
    menuItems: ICardThirteenYMenu[] = CARD_THIRTEEN_Y_MENU;
    activeTabKey: string;
    isAdditionalInfoVisible = false;
    private innerWidth!: number;
    selectedTabInitValues!: AbstractControl;
    selectedTabInitValuesModified!: string;
    selectedTabCurrentValues!: AbstractControl;
    selectedTabCurrentValuesModified!: string;
    // cardId = 696;
    cardId = 1161;
    cardInfo!: any;
    token = TOKEN;
    formValues!: any;
    isTabValid!: boolean;
    loading: boolean;
    cardStatus!: number;

    constructor(@Inject(DOCUMENT) private document: Document,
                private cardThirteenYService: CardThirteenYService,
                private tokenService: TokenService,
                private dialog: MatDialog,
                private snackBar: MatSnackBar,
                private cardService: CardService,
                private cdRef: ChangeDetectorRef,
                private eventManager: EventManager,
                @Self() private onDestroy$: NgOnDestroy) {
        localStorage.setItem('token', this.token);
        this.eventManager.addGlobalEventListener('window', 'resize', () => {
            this.innerWidth = this.document.body.offsetWidth;
            if (this.innerWidth <= 1300) {
                this.isAdditionalInfoVisible = false;
                this.cdRef.detectChanges();
            }
        });
        this.getCardStatus();
        this.getCardInfo();
        this.getActiveCardCurrentValues();
        this.getValidState();
    }

    ngOnInit() {
        this.getIsLoading();
        this.innerWidth = this.document.body.offsetWidth;
        this.checkActiveTab();
        this.checkSelectedTabInitValues();
        this.checkSelectedTabCurrentValues();
    }

    getValidState() {
        this.cardThirteenYService.isActiveTabValid
            .pipe(takeUntil(this.onDestroy$))
            .subscribe((state: boolean) => {
                this.isTabValid = state;
                this.cdRef.detectChanges();
            });
    }

    getCardStatus() {
        this.cardThirteenYService.cardStatus
            .pipe(takeUntil(this.onDestroy$))
            .subscribe(status => {
                this.cardStatus = status;
                this.cdRef.detectChanges();
            });
    }

    getCardInfo() {
        this.cardThirteenYService.getCardInfo(this.cardId)
            .pipe(takeUntil(this.onDestroy$))
            .subscribe(data => {
                this.cardInfo = data;
                this.cardThirteenYService.checkCardStatus(this.cardInfo.status.id);
                this.checkCardStatus();
                this.cardThirteenYService.setTabInitValues(data);
            });
    }

    checkCardStatus() {
        if (this.cardInfo.status.id === 2 || this.cardInfo.status.id === 4) {
            this.cardThirteenYService.setBlockedMode(true);
        }
    }

    getActiveCardCurrentValues() {
        this.cardThirteenYService.activeTabCurrentValues
            .pipe(
                skip(1),
                takeUntil(this.onDestroy$)
            )
            .subscribe(data => this.formValues = data);
    }

    getIsLoading() {
        this.cardThirteenYService.isLoading$
            .pipe(takeUntil(this.onDestroy$))
            .subscribe((data: boolean) => {
                this.loading = data;
                this.cdRef.detectChanges();
            });
    }

    checkActiveTab() {
        this.cardThirteenYService.activeTab
            .pipe(takeUntil(this.onDestroy$))
            .subscribe((key: string) => {
                this.activeTabKey = key;
                this.cdRef.markForCheck();
            });
    }

    checkSelectedTabInitValues() {
        this.cardThirteenYService.selectedTabInitValues
            .pipe(takeUntil(this.onDestroy$))
            .subscribe(data => {
                this.selectedTabInitValues = data;
                this.selectedTabInitValuesModified = JSON.stringify(data);
                this.cdRef.detectChanges();
            });
    }

    checkSelectedTabCurrentValues() {
        this.cardThirteenYService.selectedTabCurrentValues
            .pipe(takeUntil(this.onDestroy$))
            .subscribe(data => {
                if (data) {
                    this.selectedTabCurrentValues = data;
                    this.selectedTabCurrentValuesModified = JSON.stringify(data);
                } else {
                    this.selectedTabCurrentValues = null;
                    this.selectedTabCurrentValuesModified = '';
                }
                this.cdRef.detectChanges();
            });
    }

    changeTab(tabKey: string) {
        if (tabKey !== this.activeTabKey) {
            if (!this.isTabValid || (JSON.stringify(this.selectedTabInitValues) === JSON.stringify(this.selectedTabCurrentValues))
                || !this.selectedTabCurrentValues) {
                this.cardThirteenYService.setActiveTab(tabKey);
            } else {
                this.dialog.open(SaveConfirmComponent, {panelClass: '__save-confirm'}).afterClosed()
                    .subscribe(value => value && value.save ? this.saveCard(tabKey) : this.cardThirteenYService.setActiveTab(tabKey));
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
            this.dialog.open(AdditionalInformationComponent, {
                panelClass: '__additional-dialog',
                data: this.cardInfo
            });
        }
    }

    saveCard(tabKey?: string) {
        this.cardThirteenYService.saveCard(this.formValues).subscribe(data => {
            this.cardThirteenYService.setTabInitValues(data);
            this.cardThirteenYService.setSelectedTabCurrentValues(null);
            if (tabKey) {
                this.cardThirteenYService.setActiveTab(tabKey);
            }
            this.snackBar.open('Сохранено', 'ОК', {duration: 5000});
        }, error => this.snackBar.open('Ошибка', 'ОК', {duration: 5000}));
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
