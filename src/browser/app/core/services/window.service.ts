import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
    providedIn: 'root'
})
export class WindowService {

    constructor(
        @Inject(PLATFORM_ID) private platform: any
    ) { }

    get() {
        return (isPlatformBrowser(this.platform)) ? window : null;
    }
}
