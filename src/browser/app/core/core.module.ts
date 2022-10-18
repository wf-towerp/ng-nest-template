import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { RequestInterceptor } from './interceptors';
import { AnonymousGuard, AuthorizedGuard } from './guards';



@NgModule({
    declarations: [],
    imports: [
        CommonModule
    ],
    providers: [
        {
            provide: HTTP_INTERCEPTORS,
            useClass: RequestInterceptor,
            multi: true
        },
        AnonymousGuard,
        AuthorizedGuard,
    ]
})
export class CoreModule { }
