import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import {IAccountingFormValue} from './shared/interfaces/accounting-form-value.interface';
import {IAgeGroupValue} from './shared/interfaces/age-group-value.interface';
import {IChildCategoryValue} from './shared/interfaces/child-category-value.interface';

@Injectable({
  providedIn: 'root'
})
export class CardCreateService {
  baseUrl = 'http://ds-dev.rt-eu.ru/api/';

  constructor(private http: HttpClient) {}

  getCardTypes(): Observable<IAccountingFormValue[]> {
    return this.http.get<IAccountingFormValue[]>(`${this.baseUrl}dictionary/card-types`);
  }

  getChildCategories(): Observable<IChildCategoryValue[]> {
    return this.http.get<IChildCategoryValue[]>(`${this.baseUrl}dictionary/child-categories`);
  }

  getAgeGroups(): Observable<IAgeGroupValue[]> {
    return this.http.get<IAgeGroupValue[]>(`${this.baseUrl}dictionary/age-groups`);
  }

  createCard(newCard) {
    return this.http.post<any>(`${this.baseUrl}cards`, newCard);
  }

  getCardById(id) {
    return this.http.get<any>(`${this.baseUrl}cards/${id}/`);
  }
}
