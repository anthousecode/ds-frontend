import {Injectable} from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class CardService {
    thirteenYCardId: number;
    patientId = 16995;

    setThirteenYCardId(id: number) {
        this.thirteenYCardId = id;
    }
}
