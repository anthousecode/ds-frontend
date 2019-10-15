import {Injectable} from '@angular/core';
import {
    HttpErrorResponse,
    HttpEvent,
    HttpHandler,
    HttpInterceptor,
    HttpRequest
} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Router} from '@angular/router';
import {tap} from 'rxjs/operators';

@Injectable()
export class ApiWithCredentialInterceptor implements HttpInterceptor {
    constructor(private router: Router) {
    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        req = req.clone({
            withCredentials: true
        });
        return next.handle(req).pipe(tap(
            (event) => {
                console.log('http event', event);
            },
            (error: any) => {
                if (error instanceof HttpErrorResponse && error.status === 401) {
                    window.location.href = '/saml/login';
                }
            }
        ));
    }
}
