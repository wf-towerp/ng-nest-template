import { Injectable } from '@nestjs/common';

@Injectable()
export class HelloWorldService {

    helloWorld(name?: string) {
        return `Hello ${name || 'world'}!`;
    }
}
