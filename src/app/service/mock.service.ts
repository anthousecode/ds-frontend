import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})


export class MockService {
  constructor() {
  }


  static colorChange(talon: any) {
    if (!talon.isEnabled) {
      return 'dis';
    } else if (talon.isEnabled && talon.isDeclined) {
      return 'otkaz';
    } else if (talon.isEnabled && !talon.isDeclined && talon.listWait && !talon.hospNextYear) {
      return 'wait';
    } else if (talon.isEnabled && !talon.isDeclined && talon.listWait && talon.hospNextYear) {
      return 'next-year';
    } else if (talon.isEnabled && !talon.isDeclined && talon.maxEtap === 6) {
      return 'prolech';
    } else if (talon.isEnabled && !talon.isDeclined && talon.maxEtap === 1
      && talon.vmpStage2.approveHospitalizationDate && !talon.vmpStage2.noticeHealthAuthority) {
      return 'need-sogl';
    } else if (talon.isEnabled && !talon.isDeclined && talon.maxEtap === 2
      && talon.vmpStage2.approveHospitalizationDate && talon.vmpStage2.noticeHealthAuthority) {
      return 'on-sogl';
    } else if (talon.isEnabled && !talon.isDeclined && talon.maxEtap === 2
      && !talon.vmpStage2.approveHospitalizationDate && talon.vmpStage2.noticeHealthAuthority) {
      return 'date-sogl';
    } else {
      return 'act';
    }
  }
}
