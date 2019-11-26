import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {catchErrorLogEmpty} from '../../@core/shared/rxjs-operators/base-catch-error.operator';
import {AbstractControl, FormGroup} from '@angular/forms';
import {BaseApiService} from '../../@core/api/shared/base-api.service';
import {IDiagnoses} from './shared/interfaces/diagnoses.interface';
import {BehaviorSubject, Observable, Subject} from 'rxjs';
import {IGroupVaccinations} from './card-vaccination/shared/vaccination.interface';
import {IAdditionalInfo} from './shared/interfaces/additional-info.interface';
import {IChangesHistory} from './shared/interfaces/changes-history.interface';
import { AdditionalResearch } from './shared/interfaces/additional-research.interface';


@Injectable({
  providedIn: 'root'
})
export class CardThirteenYService {
  getCitiesUrl = 'http://ds-dev.rt-eu.ru/addrobject/search?query=';
  getCityInfoUrl = 'http://ds-dev.rt-eu.ru/addrobject/aoid?aoid=';
  activeTab: BehaviorSubject<string> = new BehaviorSubject('main');
  activeTabInitValues: Subject<AbstractControl> = new Subject();
  activeTabCurrentValues: Subject<AbstractControl> = new Subject();

  baseUrl = 'http://ds-dev.rt-eu.ru/api/';

  constructor(private http: HttpClient,
              private apiService: BaseApiService) {

  }

  setActiveTab(tab: string) {
    this.activeTab.next(tab);
  }

  setTabInitValues(initValue: AbstractControl) {
    this.activeTabInitValues.next(initValue);
  }

  setTabCurrentValues(currentValue: AbstractControl) {
    this.activeTabCurrentValues.next(currentValue);
  }

  getControls(nameForm: FormGroup, nameGroup: string): any {
    return (nameForm.get(nameGroup) as FormGroup).controls;
  }

  getCities(text) {
    if (text) {
      return this.http.get(this.getCitiesUrl + text)
        .pipe(
          catchErrorLogEmpty()
        );
    }
  }

  getCardInfo(patientId: number) {
    return this.http.get(this.baseUrl + 'cards/' + patientId);
  }

  getCityInfo(aoid: string) {
    return this.http.get(this.getCityInfoUrl + aoid)
      .pipe(
        catchErrorLogEmpty()
      );
  }

  getAdditionalInfo(): Observable<IAdditionalInfo[]> {
    return this.apiService.get<IAdditionalInfo[]>('additional-info.json'); // TODO: remove when api will work
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

  getAdditionalResearch(): Observable<AdditionalResearch[]> {
    return this.apiService.get<AdditionalResearch[]>('additional-research.json'); // TODO: remove when api will work
  }
}
