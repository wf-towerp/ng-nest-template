import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { AuthService } from './modules/auth/services';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styles: []
})
export class AppComponent {

    authorized_checked: boolean = false;

    constructor(
        @Inject(PLATFORM_ID) private _platformId: Object,
        private _authService: AuthService,
    ) {
        this._authService.currentUser$.subscribe(user => {
            this.authorized_checked = isPlatformBrowser(this._platformId) && this._authService.authorized_checked;
        });
    }
}
