import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class CardCreateService {
    baseUrl = 'http://ds-dev.rt-eu.ru/api/';

    constructor(private http: HttpClient) {
    }

    createCard(newCard) {
        return this.http.post<any>(`${this.baseUrl}cards`, newCard);
    }

    getCardById(id) {
        return this.http.get<any>(`${this.baseUrl}cards/${id}/`);
    }
}
