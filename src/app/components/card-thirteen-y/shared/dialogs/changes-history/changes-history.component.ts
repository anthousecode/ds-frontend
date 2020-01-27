import {Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef} from '@angular/core';
import {CardThirteenYService} from '../../../card-thirteen-y.service';
import {ICardThirteenYMenu} from '../../interfaces/card-thirteen-y-menu.interface';
import {CHANGES_HISTORY_MENU} from '../../data/changes-history-menu';
import * as moment from 'moment';
import {IChangeHistoryItem, IChangesHistory} from './shared/interfaces/changes-history.interface';

@Component({
    selector: 'app-changes-history',
    templateUrl: './changes-history.component.html',
    styleUrls: ['./changes-history.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChangesHistoryComponent implements OnInit {
    historyMenu: ICardThirteenYMenu[] = CHANGES_HISTORY_MENU;
    activeTabKey = 'info';
    statusData!: IChangeHistoryItem[];
    historyChanges!: IChangeHistoryItem[];
    main!: IChangeHistoryItem[];
    assessment!: IChangeHistoryItem[];
    healthStatus!: IChangeHistoryItem[];
    research!: IChangeHistoryItem[];
    vaccination!: IChangeHistoryItem[];
    conclusion!: IChangeHistoryItem[];

    constructor(private cardThirteenYService: CardThirteenYService,
                private cdRef: ChangeDetectorRef) {
    }

    ngOnInit() {
        this.getCardHistory();
    }

    getCardHistory() {
        this.cardThirteenYService.getCardHistory().subscribe((data: IChangesHistory) => {
            this.statusData = data.cardStatus;
            this.historyChanges = [data.card[0]];
            this.main = data.card;
            this.assessment = [...data.physicalDevelopment, ...data.mentalDevelopment, ...data.sexualDevelopment];
            this.healthStatus = [...data.healthStatusBefore, ...data.diagnosisBefore, ...data.healthStatusAfter, ...data.diagnosisAfter,
                ...data.disability, ...data.disabilityDisease, ...data.disabilityDisorder];
            this.research = [...data.requiredExamination, ...data.additionalExamination];
            this.vaccination = [...data.vaccination, ...data.vaccinationRequirement];
            this.conclusion = [...data.conclusion, ...data.doctorExamination];
            this.cdRef.detectChanges();
        });
    }

    getCardCreateMessage(item: IChangeHistoryItem) {
        return `${this.getDate(item.operationDate)}, пользователь ${item.user} создал карту обследования`;
    }

    getStatusMessage(item: IChangeHistoryItem) {
        return item.operation === 'i' ? this.getStatusCreate(item) : this.getStatusEdit(item);
    }

    getStatusCreate(item: IChangeHistoryItem) {
        return `${this.getDate(item.operationDate)}, пользователь ${item.user} создал карту со статусом "${item.field.value}"`;
    }

    getStatusEdit(item: IChangeHistoryItem) {
        const date = this.getDate(item.operationDate);
        return `${date}, пользователь ${item.user} изменил статус карты с "${item.field.oldValue}" на "${item.field.value}"`;
    }

    getChangeMessage(item: IChangeHistoryItem) {
        return item.operation === 'i' ? this.getChangeCreate(item) : this.getChangeEdit(item);
    }

    getChangeCreate(item: IChangeHistoryItem) {
        const date = this.getDate(item.operationDate);
        return `${date}, пользователь ${item.user} сохранил "${item.field.description}" со значением "${item.field.value}"`;
    }

    getChangeEdit(item: IChangeHistoryItem) {
        const date = this.getDate(item.operationDate);
        return `${date}, пользователь ${item.user} изменил "${item.field.description}" с "${item.field.oldValue}" на "${item.field.value}"`;
    }

    getDate(date: string) {
        return moment(date).format('DD.MM.YYYY');
    }

    changeTab(tabKey: string) {
        if (tabKey !== this.activeTabKey) {
            this.activeTabKey = tabKey;
        }
    }
}
