import {Injectable} from '@angular/core';
import {
    HttpErrorResponse,
    HttpEvent,
    HttpHandler,
    HttpInterceptor,
    HttpRequest
} from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {Router} from '@angular/router';
import {tap} from 'rxjs/operators';
import {OAuthService} from 'angular-oauth2-oidc';

@Injectable()
export class ApiWithCredentialInterceptor implements HttpInterceptor {
    constructor(private router: Router, private oauthService: OAuthService) {
    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if (!req.url.startsWith(this.oauthService.issuer)) {
            if (!this.oauthService.hasValidAccessToken()) {
                if (this.oauthService.getRefreshToken()) {
                    this.oauthService.refreshToken();
                } else {
                    this.oauthService.tryLogin();
                }
            } else {
                return this.processRequest(req, next);
            }
        } else {
            return next.handle(req);
        }
    }

    processRequest(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        req = req.clone({
            withCredentials: true,
            setHeaders: {
                Authorization: `Bearer ${this.oauthService.getAccessToken()}`
            }
        });
        return next.handle(req).pipe(tap(
            (event) => {
                console.log('http event', event);
            },
            (error: any) => {
                if (error instanceof HttpErrorResponse && error.status === 401) {
                    this.oauthService.tryLogin();
                }
            }
        ));
    }
}
