import {Injectable} from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class CardService {
    thirteenYCardId: number;
    patientId: number = 16995;

    setThirteenYCardId(id: number) {
        this.thirteenYCardId = id;
    }
}
