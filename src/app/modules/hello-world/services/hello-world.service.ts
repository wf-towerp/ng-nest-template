import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class HelloWorldService {

    constructor(
        private _httpClient: HttpClient
    ) { }

    getHello() {
        let params = new HttpParams();
        params = params.set('name', '[your name here]');
        return this._httpClient.get('/hello-world', { responseType: 'text', params });
    }
}
