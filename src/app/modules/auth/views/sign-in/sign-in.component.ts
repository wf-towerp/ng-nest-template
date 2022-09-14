import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from '@server/modules/users/models';
import { AuthService } from '../../services';

@Component({
    selector: 'app-sign-in',
    templateUrl: './sign-in.component.html',
    styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent {

    authForm: FormGroup;

    constructor(
        private _router: Router,
        private _fb: FormBuilder,
        private _authService: AuthService,
    ) {
        this._initForm();
    }

    private _initForm(): void {
        this.authForm = this._fb.group({
            email: this._fb.control('', [Validators.required]),
            password: this._fb.control('', [Validators.required]),
        });
    }

    onSubmit(): void {
        this._authService.signIn(this.authForm.value).subscribe({
            next: (user: User) => {
                if (this._authService.redirect_url.length) {
                    this._router.navigate(this._authService.redirect_url);
                    this._authService.redirect_url = [];
                } else
                    this._router.navigate(['/home', 'dashboard']);
            },
            error: (err: HttpErrorResponse) => {
                if (err.status !== 403)
                    console.error(`Error loggging in!`, err);
            }
        });
    }

}
