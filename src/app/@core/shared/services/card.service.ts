import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CardService {
  thirteenYCardId: number;

  setThirteenYCardId(id: number) {
    this.thirteenYCardId = id;
  }
}
