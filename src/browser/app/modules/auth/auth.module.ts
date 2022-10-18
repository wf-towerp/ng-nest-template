import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthRoutingModule } from './auth-routing.module';
import { SignUpComponent } from './views/sign-up/sign-up.component';
import { SignInComponent } from './views/sign-in/sign-in.component';
import { SharedModule } from '@app/shared';


@NgModule({
    declarations: [
        SignUpComponent,
        SignInComponent
    ],
    imports: [
        CommonModule,
        AuthRoutingModule,
        SharedModule,
    ]
})
export class AuthModule { }
