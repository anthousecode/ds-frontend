import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import {CardThirteenYService} from '../card-thirteen-y.service';

import {IAdditionalInfo} from '../shared/interfaces/additional-info.interface';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-additional-information',
  templateUrl: './additional-information.component.html',
  styleUrls: ['./additional-information.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdditionalInformationComponent implements OnInit {
  additionalInfoData!: Observable<IAdditionalInfo[]>;

  constructor(private cardThirteenYService: CardThirteenYService) { }

  ngOnInit() {
    this.additionalInfoData = this.cardThirteenYService.getAdditionalInfo();
  }

  toPatientCard() {
   console.log('NAVIGATE TO CARD');
  }
}
