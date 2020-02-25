import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {catchErrorLogEmpty} from '../../@core/shared/rxjs-operators/base-catch-error.operator';
import {AbstractControl, FormGroup} from '@angular/forms';
import {BaseApiService} from '../../@core/api/shared/base-api.service';
import {BehaviorSubject, Observable, Subject} from 'rxjs';
import {finalize} from 'rxjs/operators';
import {CardService} from '../../@core/shared/services/card.service';

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
    cardId: number;

    baseUrl = 'http://ds-dev.rt-eu.ru/api/';
    getCitiesUrl = 'http://ds-dev.rt-eu.ru/addrobject/search?query=';

    constructor(private http: HttpClient,
                private apiService: BaseApiService,
                private cardService: CardService) {
        this.setCardId();
    }

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

    checkCardStatus(status: number) {
        this.cardStatus.next(status);
    }

    setLoading(loader: boolean) {
        this.isLoading.next(loader);
    }

    setBlockedMode(isBlocked: boolean) {
        this.isBlocked.next(isBlocked);
    }

    setCardId() {
        this.cardId = this.cardService.thirteenYCardId;
    }

    disableResetControl(group: FormGroup, first: string, second?: string) {
        const firstLevel = group.get(first);
        if (second) {
            firstLevel.get(second).disable();
            firstLevel.get(second).setValue('');
        } else {
            firstLevel.disable();
            firstLevel.setValue('');
        }
    }

    saveCard(values) {
        const card = {
            card: {}
        };
        card.card = values;
        this.setLoading(true);
        return this.http.patch(this.baseUrl + 'cards/' + this.cardId, card)
            .pipe(finalize(() => this.setLoading(false)));
    }

    setCardStatus(statusParams) {
        const params = statusParams;
        return this.http.put(this.baseUrl + 'cards/' + this.cardId + '/status', params);
    }

    getCities(text) {
        if (text) {
            return this.http.get(this.getCitiesUrl + text)
                .pipe(catchErrorLogEmpty());
        }
    }

    getCardInfo() {
        this.setLoading(true);
        return this.http.get(this.baseUrl + 'cards/' + this.cardId)
            .pipe(finalize(() => this.setLoading(false)));
    }

    getCardHistory() {
        this.setLoading(true);
        return this.http.get(this.baseUrl + 'cards/' + this.cardId + '/log')
            .pipe(finalize(() => this.setLoading(false)));
    }

    exportCard(format: string) {
        return this.http.get(this.baseUrl + 'cards/' + this.cardId + '.' + format, {responseType: 'blob'});
    }






    getMovies() {
        return this.apiService.get('movies.json');
    }

    getMoviePerson(id: number) {
        return this.apiService.get(`movie${id}.json`);
    }
}
