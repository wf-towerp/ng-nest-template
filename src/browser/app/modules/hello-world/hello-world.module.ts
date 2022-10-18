import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HelloWorldRoutingModule } from './hello-world-routing.module';
import { HelloWorldComponent } from './views/hello-world/hello-world.component';
import { SharedModule } from '@app/shared';


@NgModule({
    declarations: [
        HelloWorldComponent
    ],
    imports: [
        CommonModule,
        HelloWorldRoutingModule,

        SharedModule,
    ]
})
export class HelloWorldModule { }
