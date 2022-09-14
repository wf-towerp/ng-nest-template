import { Inject, Injectable, Optional, PLATFORM_ID } from '@angular/core';
import { IUser, User } from '@server/modules/users/models';
import { BehaviorSubject, lastValueFrom, map, Observable } from 'rxjs';
import { Request } from 'express';
import { REQUEST } from '@nguniversal/express-engine/tokens';
import { DOCUMENT, isPlatformServer } from '@angular/common';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    private _user: User = null;

    currentUser$: BehaviorSubject<User> = new BehaviorSubject(this.user);

    private _cookies: string = '';

    timeout: any;

    redirect_url: string[] = [];

    private _authorized_checked: boolean = false;

    constructor(
        @Inject(PLATFORM_ID) private _platformId: Object,
        @Optional() @Inject(REQUEST) private _request: Request,
        @Inject(DOCUMENT) private _document: Document,
        private _http: HttpClient,
        private _router: Router,
    ) {
        this._cookies = (isPlatformServer(this._platformId)) ? (this._request?.headers?.cookie || '') : this._document.cookie;
    }

    get authorized_checked() {
        return this._authorized_checked;
    }

    get user(): User {
        return new User({ ...this._user });
    }

    set user(user: User) {
        this._user = new User({
            ...user,
            accessToken: undefined
        });

        this.currentUser$.next(this.user);

        // if (isPlatformBrowser(this._platformId)) {
        //     if (user?.accessToken)
        //         this._scheduleRenewToken();
        //     else
        //         clearTimeout(this.timeout);
        // }
    }

    private async _scheduleRenewToken() {
        if (this.user.logged_refresh)
            await this.renewToken(this.user.logged_refresh.getTime() - new Date().getTime());
    }

    getCurrenUser() {
        return this._http.get('/users/my-data').pipe(map((user: IUser) => new User(user)));
    }

    async checkAuthorized(): Promise<User | undefined> {
        let user: User = new User();

        const user$ = this._http.get<IUser>('/auth');
        const logged_user: IUser = await lastValueFrom(user$);


        if (logged_user) {
            const current_user$ = this.getCurrenUser();
            const current_user = await lastValueFrom(current_user$);
            user = new User({
                ...logged_user,
                ...current_user,
            });
        }

        this._authorized_checked = true;

        this.user = user;

        // if (this.user.id)
            return this.user;
    }

    checkActivationToken(token: string): Observable<User> {
        return this._http.post(
            '/auth/validate-token',
            { token }
        ).pipe(map((res: IUser) => new User(res)));
    }

    signUp(user: IUser): Observable<User> {
        return this._http.post(
            '/auth/sign-up',
            user
        ).pipe(
            map((result: IUser) => {
                this.user = new User(result);
                return this.user;
            })
        );
    }

    signIn(user: IUser): Observable<IUser> {
        const headers: HttpHeaders = new HttpHeaders({
            'Content-Type': 'application/x-www-form-urlencoded'
        });

        let params: HttpParams = new HttpParams();
        Object.keys(user).forEach(key => {
            params = params.set(key, user[key]);
        });

        return this._http.post<User>(
            '/auth/sign-in',
            params,
            { headers }
        ).pipe(
            map((result: IUser) => {
                this.user = new User({
                    ...user,
                    ...result
                });
                return this.user;
            })
        );
    }

    signOut(): void {
        this._http.post('/auth/sign-out', {}).subscribe(() => {
            this.user = null;
            clearTimeout(this.timeout);
            this._router.navigate(['/auth', 'sign-in']);
        });
    }

    renewToken(timeout: number = 0): Promise<void> {
        return new Promise((resolve) => {
            clearTimeout(this.timeout);
            if (timeout > 0) {
                this.timeout = setTimeout(() => {
                    this._http.post(
                        '/auth/renew-token',
                        {},
                    ).pipe(
                        map((new_token: IUser) => {
                            this.user = new User({
                                ...this.user,
                                ...new_token,
                            });
                        })
                    ).subscribe(() => {
                        resolve();
                    });
                }, timeout);
            } else
                resolve();
        });
    }
}
