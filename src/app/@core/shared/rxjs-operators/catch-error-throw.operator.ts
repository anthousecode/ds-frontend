import {OperatorFunction, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';

export function catchErrorLogThrow<T>(): OperatorFunction<T, T | never> {
    return input$ => input$.pipe(
        catchError(error => {
            console.error(error);
            return throwError(error);
        })
    );
}
