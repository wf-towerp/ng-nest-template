import { Module } from '@nestjs/common';
import { HelloWorldController } from './hello-world.controller';
import { HelloWorldService } from './services/hello-world.service';

@Module({
    controllers: [
        HelloWorldController
    ],
    providers: [
        HelloWorldService
    ],
    exports: [
        HelloWorldService
    ]
})
export class HelloWorldModule { }
