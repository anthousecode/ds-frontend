import {Component, Inject, OnInit} from '@angular/core';
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

@Component({
    selector: 'app-patient-history-modal',
    templateUrl: './patient-history-modal.component.html',
    styleUrls: ['./patient-history-modal.component.sass']
})

export class PatientHistoryModalComponent implements OnInit {

    constructor(@Inject(MAT_DIALOG_DATA) public idPatient: number,
                private apiPatient: PatientService, private apiDictionary: DictionaryService) {
        this.getDictionary();
    }

    patientHistory: PatientHistoryDisplay[];
    patientDictionary: PatientDictionary[];
    patientDocumentHistory: PatientHistoryDocumentDisplay[];
    initHistory: PatientHistory;

    static convertDate(date) {
        return new Date(date).toLocaleString().split(',')[0];
    }

    ngOnInit() {
    }

    getPatientHistoryDocument(id: number) {
        this.apiPatient.getHistoryPatientDocument(id).subscribe(
            response => {
                for (const item of response) {
                    if (item.issuedDate === null) {
                        item.issuedDate = 'не указано';
                    } else if (item.issuedBy == null) {
                        item.issuedBy = 'не указано';
                    } else {
                        item.issuedDate = PatientHistoryModalComponent.convertDate(item.issuedDate);
                    }
                }
                this.displayHistoryDocument(response);
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
            const fields = ['series', 'number', 'issuedBy', 'issuedDate', 'isEnabled'];
            if (accumulator[current.documentType.id] === undefined) {
                accumulator[current.documentType.id] = {
                    id: current.documentType.id,
                    name: current.documentType.name,
                    historyChange: []
                };
            }
            const historyChange = accumulator[current.documentType.id].historyChange;
            const previous = historyChange.length > 0 ? historyChange[historyChange.length - 1] : null;
            if (previous !== null) {
                const changed = [];
                for (const field of fields) {
                    if (previous[field] !== current[field]) {
                        const translate = {
                            name: field,
                            current: current[field],
                            old: previous[field],
                            operation: current.operation
                        };
                        changed.push(this.converterText(translate));
                    }
                }
                current.changed = changed;
            }
            accumulator[current.documentType.id].historyChange.push(current);
            return accumulator;
        }, {});
        this.patientDocumentHistory = Object.values(changedHistory);
    }

    displayHistory(history: PatientHistory[]) {
        const changedHistory = history.reduce((accumulator, current) => {
            const fields = ['name', 'surname', 'patronymic', 'snils', 'birthdate', 'isParentDocument'];
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
                            current: current[field],
                            old: previous[field],
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
        this.apiPatient.getHistoryPatient(this.idPatient).subscribe(
            (history: PatientHistory[]) => {
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


