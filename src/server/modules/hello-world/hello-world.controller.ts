import { Controller, Get, Query } from '@nestjs/common';
import { HelloWorldService } from './services';

@Controller('hello-world')
export class HelloWorldController {

    constructor(
        private _helloWorldService: HelloWorldService,
    ) {}

    @Get('')
    getHelloWorld(@Query('name') name?: string) {
        return this._helloWorldService.helloWorld(name);
    }
}
