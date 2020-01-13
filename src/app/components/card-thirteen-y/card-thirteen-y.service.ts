import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {catchErrorLogEmpty} from '../../@core/shared/rxjs-operators/base-catch-error.operator';
import {AbstractControl, FormGroup} from '@angular/forms';
import {BaseApiService} from '../../@core/api/shared/base-api.service';
import {IDiagnoses} from './shared/interfaces/diagnoses.interface';
import {BehaviorSubject, Observable, Subject} from 'rxjs';
import {AdditionalResearch} from './shared/interfaces/additional-research.interface';
import {finalize} from 'rxjs/operators';
import {IChangesHistory} from './shared/interfaces/changes-history.interface';

@Injectable({
    providedIn: 'root'
})
export class CardThirteenYService {
    activeTab: BehaviorSubject<string> = new BehaviorSubject('main');
    activeTabInitValues: BehaviorSubject<any> = new BehaviorSubject(false);
    activeTabCurrentValues: BehaviorSubject<any> = new BehaviorSubject(false);
    selectedTabInitValues: Subject<AbstractControl> = new Subject();
    selectedTabCurrentValues: Subject<AbstractControl> = new Subject();
    isActiveTabValid: Subject<boolean> = new Subject<boolean>();
    isLoading: BehaviorSubject<boolean> = new BehaviorSubject(false);
    isLoading$: Observable<boolean> = this.isLoading.asObservable();
    isBlocked: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    cardStatus: Subject<number> = new Subject();

    baseUrl = 'http://ds-dev.rt-eu.ru/api/';
    getCitiesUrl = 'http://ds-dev.rt-eu.ru/addrobject/search?query=';

    constructor(private http: HttpClient,
                private apiService: BaseApiService) {}

    setActiveTab(tab: string) {
        this.activeTab.next(tab);
    }

    setActiveTabValid(state: boolean) {
        this.isActiveTabValid.next(state);
    }

    setTabInitValues(initValue) {
        this.activeTabInitValues.next(initValue);
    }

    setTabCurrentValues(currentValue) {
        this.activeTabCurrentValues.next(currentValue);
    }

    setSelectedTabInitValues(initValue: AbstractControl) {
        this.selectedTabInitValues.next(initValue);
    }

    setSelectedTabCurrentValues(currentValue: AbstractControl) {
        this.selectedTabCurrentValues.next(currentValue);
    }

    checkCardStatus(status) {
        this.cardStatus.next(status);
    }

    setLoading(loader: boolean) {
        this.isLoading.next(loader);
    }

    setBlockedMode(isBlocked: boolean) {
        this.isBlocked.next(isBlocked);
    }

    getControls(nameForm: FormGroup, nameGroup: string): any {
        return (nameForm.get(nameGroup) as FormGroup).controls;
    }

    saveCard(values) {
        const card = {
            card: {}
        };
        card.card = values;
        this.setLoading(true);
        return this.http.patch(this.baseUrl + 'cards/696', card)
            .pipe(finalize(() => this.setLoading(false)));
    }

    setCardStatus(statusParams) {
        const params = statusParams;
        return this.http.put(this.baseUrl + 'cards/696/status', params);
    }

    getCities(text) {
        if (text) {
            return this.http.get(this.getCitiesUrl + text)
                .pipe(catchErrorLogEmpty());
        }
    }

    getCardInfo(patientId: number) {
        this.setLoading(true);
        return this.http.get(this.baseUrl + 'cards/' + patientId)
            .pipe(finalize(() => this.setLoading(false)));
    }

    getHistory(): Observable<IChangesHistory> {
        return this.apiService.get<IChangesHistory>('changes-history.json'); // TODO: remove when api will work
    }

    getDiagnoses(): Observable<IDiagnoses[]> {
        return this.apiService.get<IDiagnoses[]>('diagnoses.json'); // TODO: remove when api will work
    }

    getDiagnosesAfter(): Observable<IDiagnoses[]> {
        return this.apiService.get<IDiagnoses[]>('diagnoses-after.json'); // TODO: remove when api will work
    }

    exportCard(format: string) {
        return this.http.get(this.baseUrl + 'cards/696.' + format, {responseType: 'blob'});
    }

    getAdditionalResearch(): Observable<AdditionalResearch[]> {
        return this.apiService.get<AdditionalResearch[]>('additional-research.json'); // TODO: remove when api will work
    }
}
