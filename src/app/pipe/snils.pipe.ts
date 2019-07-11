import {Pipe, PipeTransform} from '@angular/core';

@Pipe({name: 'snils'})
export class SnilsPipe implements PipeTransform {

    transform(value: string): string {
        if (value.length === 11) {
            return value.substr(0, 3)
                + '-' + value.substr(3, 3)
                + '-' + value.substr(6, 3)
                + ' ' + value.substr(9);
        }

        return value;
    }

}
