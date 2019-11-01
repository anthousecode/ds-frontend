import {AfterViewInit, Component, EventEmitter, Inject, OnInit} from '@angular/core';
import {
    PatientHistory,
    PatientHistoryDisplay,
    PatientHistoryDocument,
    PatientHistoryDocumentDisplay
} from '../../../models/patient.model';
import {MAT_DIALOG_DATA} from '@angular/material';
import {PatientService} from '../../../service/patient.service';
import {DictionaryService} from '../../../service/dictionary.service';
import {PatientDictionary} from '../../../models/dictionary.model';
import * as moment from 'moment';
import {MaterializeAction} from '@samuelberthe/angular2-materialize';
import { finalize } from 'rxjs/operators';

@Component({
    selector: 'app-patient-history-modal',
    templateUrl: './patient-history-modal.component.html',
    styleUrls: ['./patient-history-modal.component.sass']
})

export class PatientHistoryModalComponent implements OnInit, AfterViewInit {

    constructor(@Inject(MAT_DIALOG_DATA) public idPatient: number,
                private apiPatient: PatientService, private apiDictionary: DictionaryService) {
        this.getDictionary();
    }

    patientHistory: PatientHistoryDisplay[];
    patientDictionary: PatientDictionary[];
    patientDocumentHistory: PatientHistoryDocumentDisplay[];
    initHistory: PatientHistory;
    tabActions = new EventEmitter<string|MaterializeAction>();
    loading = true;

    static convertDate(date) {
        return new Date(date).toLocaleString().split(',')[0];
    }

    ngOnInit() {
    }

    ngAfterViewInit(): void {
        this.tabActions.emit({action: 'updateTabIndicator', params: []});
    }

    getPatientHistoryDocument(id: number) {
        this.apiPatient.getHistoryPatientDocument(id).subscribe(
            response => {
                this.displayHistoryDocument(response);
                this.tabActions.emit({action: 'updateTabIndicator', params: []});
            }
        );
    }

    /**
     * С помощью reduce мы делаем итерацию и ищем изменения.
     * @param history - история пациента Документы
     * 1. Инициализируем список отслежований изменений fields
     * 2. Сортируем наш список по типу документов
     * 3. Смотрим изменение и добавляем в массив изменений
     * 4. Конвертируем наш список на русский язык
     * 5. Отдаем в виде массива.
     */
    displayHistoryDocument(history: PatientHistoryDocument[]) {
        const changedHistory = history.reduce((accumulator, current) => {
            const fields = {documSerial: 'Серия', documNumber: 'Номер', isEnabled: 'Активный'};
            if (accumulator[current.id] === undefined) {
                accumulator[current.id] = {
                    id: current.id,
                    name: current.type.name,
                    historyChange: []
                };
            }
            const historyChange = accumulator[current.id].historyChange;
            const previous = historyChange.length > 0 ? historyChange[historyChange.length - 1] : null;
            if (previous !== null) {
                const changed = [];
                for (const field in fields) {
                    if (previous[field] !== current[field]) {
                        const translate = {
                            name: fields[field],
                            current: current[field],
                            old: previous[field],
                            operation: current.operation
                        };
                        changed.push(this.converterText(translate));
                    }
                }
                current.changed = changed;
            }
            accumulator[current.id].historyChange.push(current);
            return accumulator;
        }, {});
        this.patientDocumentHistory = Object.values(changedHistory);
    }

    displayHistory(history: PatientHistory[]) {
        const changedHistory = history.reduce((accumulator, current) => {
            const fields = ['firstName', 'lastName', 'patronymic', 'snils', 'birthdate', 'isParentDocument'];
            if (accumulator[current.id] === undefined) {
                accumulator[current.id] = {
                    id: current.id,
                    name: current.name,
                    historyChange: []
                };
            }
            const historyChange = accumulator[current.id].historyChange;
            const previous = historyChange.length > 0 ? historyChange[historyChange.length - 1] : null;
            if (previous !== null) {
                const changed = [];
                for (const field of fields) {
                    if (previous[field] !== current[field]) {
                        const translate = {
                            name: field,
                            current: current[field] || 'пусто',
                            old: previous[field] || 'пусто',
                            operation: current.operation,
                        };
                        changed.push(this.converterText(translate));
                    }
                }
                current.changed = changed;
            }
            accumulator[current.id].historyChange.push(current);
            return accumulator;
        }, {});

        this.patientHistory = Object.values(changedHistory);
    }


    getDictionary() {
        this.apiDictionary.getTranslations().subscribe(
            data => {
                this.patientDictionary = data;
                this.getHistory();
                this.getPatientHistoryDocument(this.idPatient);
            }
        );
    }

    getHistory() {
        this.apiPatient.getHistoryPatient(this.idPatient)
            .pipe(finalize(() => this.loading = false))
            .subscribe(
            (history: PatientHistory[]) => {
                history = history.map(item => {
                    return {...item, birthdate: moment(moment(item.birthdate)).format('DD.MM.YYYY')};
                });
                this.initHistory = history[0];
                if (history.length > 1) {
                    this.displayHistory(history);
                }
            }
        );
    }


    /**
     *  Конвертируем в руский язык (данные типо i- create etc)
     * @param changeValue - Конечный результат которые изменились
     * И в конце добавляет в список историю пациента
     */
    converterText(changeValue) {
        for (const [key] of Object.entries(changeValue)) {
            for (const item of this.patientDictionary) {
                if (changeValue[key] === item.name) {
                    changeValue[key] = item.value;
                }
            }
        }
        return changeValue;
    }
}


