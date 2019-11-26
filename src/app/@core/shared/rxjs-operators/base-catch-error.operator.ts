import {EMPTY, OperatorFunction} from 'rxjs';
import {catchError} from 'rxjs/operators';

export function catchErrorLogEmpty<T>(): OperatorFunction<T, T | never> {
  return input$ => input$.pipe(
    catchError(error => {
      console.error(error);
      return EMPTY;
    })
  );
}
