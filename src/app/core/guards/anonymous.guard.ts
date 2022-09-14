import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '@app/modules/auth/services';

/**
 * Guard that checks if current user is not logged, e.g. anonymous
 */
@Injectable()
export class AnonymousGuard implements CanActivate {

    /**
     *
     * @param {AuthService} _authService Injection of the Authorization service
     * @param {Router} _router Injection of the Angular Router
     */
    constructor(
        @Inject(PLATFORM_ID) private _platformId: Object,
        private _authService: AuthService,
        private _router: Router
    ) { }

    /**
     * @description After checking if user is logged, this method returns false if it's not and redirects to /home or just returns true (the user is not logged)
     * @param {ActivatedRouteSnapshot} next A snapshot of current state of the activated route
     * @param {RouterStateSnapshot} state Snapshot of the Router state
     * @returns {Observable<boolean>|Promise<boolean>|boolean}
     */
    canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<boolean> | Promise<boolean> | boolean {
        if (this._authService.user?.id) {
            this._router.navigate(['/home', 'dashboard']);
            return false;
        }
        return true;
    }
}
