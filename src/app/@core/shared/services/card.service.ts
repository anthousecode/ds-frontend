import {Injectable} from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class CardService {
    // thirteenYCardId = 696;
    // thirteenYCardId = 1161;
    thirteenYCardId!: number;
    patientId = 16995;

    setThirteenYCardId(id: number) {
        this.thirteenYCardId = id;
    }
}
