import { Injectable } from '@angular/core';
import {
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpInterceptor,
    HttpResponse,
    HttpErrorResponse
} from '@angular/common/http';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { environment } from '@env/environment';
import { Router } from '@angular/router';
import { Tools } from '@common/tools.function';

@Injectable()
export class RequestInterceptor implements HttpInterceptor {

    // private _DOMAIN: string = environment.DOMAIN.replace(/^(http(?:s)?\:\/\/(?:.+?))\/(.+?)$/, `$1${environment.PORT ? ':' + environment.PORT : ''}/$2`);
    private _DOMAIN: string = Tools.API_URL;

    constructor(
        private _router: Router,
    ) { }

    intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
        if (req.url.startsWith('http') || req.url.startsWith('file'))
            return next.handle(req).pipe(
                tap((response: HttpResponse<any>) => (response instanceof HttpResponse) ? response.body : response),
                catchError(this._catchAction)
            );
        else {

        }
        if (!req.url.startsWith('http') && !req.url.startsWith('file')) {
            const req_url: string = `${this._DOMAIN}${(req.url.charAt(0) !== '/') ? '/' : ''}${req.url}`;

            return next.handle(req.clone({
                url: req_url,
            }));
        } else
            return next.handle(req);
    }

    private _catchAction(err: HttpErrorResponse): Observable<never> {
        if (err.status === 401) {
            this._router.navigate(['/auth', 'sign-in']);
            return null;
        }

        if (err.status && err.status !== 200) {
            console.error(err);
            return throwError(() => new Error(err.message));
        }
    }
}
