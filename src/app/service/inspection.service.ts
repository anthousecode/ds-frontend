import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {Observable} from 'rxjs';
import {InspectionModel} from '../models/inspection.model';

@Injectable({
    providedIn: 'root'
})
export class InspectionService {
    inspectionUrl = environment.apiUrl + '/inspection_card';

    constructor(private http: HttpClient) {
    }

    getInspection(id: number): Observable<InspectionModel[]> {
        return this.http.get<InspectionModel[]>(this.inspectionUrl + '/' + id);
    }
}
