import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({
  name: 'age'
})
export class AgePipe implements PipeTransform {

  transform(value: Date): string {
    const today = moment();
    const birthdate = moment(value);
    const years = today.diff(birthdate, 'years');
    let html: string = years + ' лет ';

    html += today.subtract(years, 'years').diff(birthdate, 'months') + ' мес';

    return html;
  }


}
