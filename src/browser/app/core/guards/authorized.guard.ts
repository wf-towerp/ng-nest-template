
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '@app/modules/auth/services';
import { User } from '@server/modules/users/models';

@Injectable()
export class AuthorizedGuard implements CanActivate {
    constructor(
        private _authService: AuthService,
        private _router: Router
    ) { }

    canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<boolean> | Promise<boolean> | boolean {
        if (!this._authService.user?.id) {
            const redirect_url = state.url.split('/').filter(x => !!x);
            redirect_url[0] = `/${redirect_url[0]}`;
            this._authService.redirect_url = redirect_url;
            this._router.navigate(['/auth', 'sign-in']);
            return false;
        }
        return true;
    }
}
