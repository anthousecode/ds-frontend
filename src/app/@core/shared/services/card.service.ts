import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CardService {
  thirteenYCardId: number;

  constructor() {
  }

  setThirteenYCardId(id: number) {
    this.thirteenYCardId = id;
  }
}
