import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class CardCreateService {
    baseUrl = 'http://ds-dev.rt-eu.ru/api/';

    constructor(private http: HttpClient) {
    }

    getCardTypes(): Observable<any> {
        return this.http.get<any>(
            `${this.baseUrl}dictionary/card-types`
        );
    }

    getChildCategories(): Observable<any> {
        return this.http.get<any>(
            `${this.baseUrl}dictionary/child-categories`
        );
    }

    getAgeGroups(): Observable<any> {
        return this.http.get<any>(
            `${this.baseUrl}dictionary/age-groups`
        );
    }

    createCard(newCard) {
        return this.http.post<any>(
            `${this.baseUrl}cards`, newCard
        );
    }

    getCardById(id) {
        return this.http.get<any>(`${this.baseUrl}cards/${id}/`);
    }
}
