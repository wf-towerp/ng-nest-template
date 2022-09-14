import { Component, OnInit } from '@angular/core';
import { AuthService } from '@app/modules/auth/services';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

    constructor(
        private _authService: AuthService
    ) { }

    ngOnInit(): void {
    }

    onSignOut() {
        this._authService.signOut();
    }

}
