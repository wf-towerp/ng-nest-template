import { Component, OnInit } from '@angular/core';
import { HelloWorldService } from '../../services';

@Component({
    selector: 'app-hello-world',
    templateUrl: './hello-world.component.html',
    styleUrls: ['./hello-world.component.scss']
})
export class HelloWorldComponent implements OnInit {

    title: string = 'not loaded yet!';

    constructor(
        private _helloWorldService: HelloWorldService
    ) {
        this._helloWorldService.getHello().subscribe((res: string) => {
            this.title = res;
        });
    }

    ngOnInit(): void {
    }

}
