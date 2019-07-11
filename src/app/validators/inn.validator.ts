import {AbstractControl} from '@angular/forms';

export function ValidateINN(inputNumber: AbstractControl): { [key: string]: boolean } | null {
  const stringInn = (inputNumber.value + '').split('').map(Number);
  if (stringInn.length > 9) {
    if ((stringInn.length === 10)
      &&
      (stringInn[9] === ((2 * stringInn[0] + 4 * stringInn[1] + 10 *
        stringInn[2] + 3 * stringInn[3] + 5 *
        stringInn[4] + 9 * stringInn[5] + 4 *
        stringInn[6] + 6 * stringInn[7] + 8 *
        stringInn[8]
      ) % 11) % 10)) {
      return null;
    } else if (
      (stringInn.length === 12)
      &&
      ((stringInn[10] === ((7 * stringInn[0] + 2 * stringInn[1] + 4 * stringInn[2] +
          10 * stringInn[3] + 3 * stringInn[4] + 5 * stringInn[5] +
          9 * stringInn[6] + 4 * inputNumber[7] + 6 * stringInn[8] +
          8 * stringInn[9]
        ) % 11) % 10)
        &&
        (stringInn[11] === ((3 * stringInn[0] + 7 * stringInn[1] + 2 * stringInn[2] +
          4 * stringInn[3] + 10 * stringInn[4] + 3 * stringInn[5] + 5 * stringInn[6] +
          9 * stringInn[7] + 4 * stringInn[8] + 6 * stringInn[9] + 8 * stringInn[10]
        ) % 11) % 10))
    ) {
      return null;
    } else {
      return {inn: false};
    }
  } else {
    return null;
  }

}
