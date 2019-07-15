import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {Observable} from "rxjs";
import {Inspection} from "../interface/inspection";

@Injectable({
    providedIn: 'root'
})
export class InspectionService {
    inspectionUrl = environment.apiUrl + '/inspection_card';

    constructor(private http: HttpClient) {
    }

    getInspection(id: number): Observable<Inspection[]> {
        return this.http.get<Inspection[]>(this.inspectionUrl + '/' + id);
    }
}
