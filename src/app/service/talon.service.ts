import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable} from 'rxjs';
import { map} from 'rxjs/operators';
import { environment } from '../../environments/environment';
import {Talon, TalonResponse} from '../interface/talon';

@Injectable({
    providedIn: 'root'
})
export class TalonService {

    private talonUrl = environment.apiUrl + '/api/talon';

    constructor(private http: HttpClient) { }

    getTalon(id: number): Observable<TalonResponse> {
        return this.http.get<TalonResponse>(this.talonUrl + '/' + id)
            .pipe(
                map(response => {
                    response.talon.date = new Date(response.talon.date);
                    response.talon.createDate = new Date(response.talon.createDate);
                    response.talon.modificationDate = new Date(response.talon.modificationDate);

                    return response;
                })
            );
    }

    putTalon(talon: Talon): Observable<any> {
        return this.http.put(this.talonUrl + '/' + talon.id, {talon});
    }
}
