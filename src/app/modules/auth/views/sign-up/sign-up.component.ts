import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CustomValidators } from '@app/shared/validators';
import { User } from '@server/modules/users/models';
import { AuthService } from '../../services';

@Component({
    selector: 'app-sign-up',
    templateUrl: './sign-up.component.html',
    styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent {

    authForm: FormGroup;

    constructor(
        private _router: Router,
        private _fb: FormBuilder,
        private _authService: AuthService
    ) {
        this._initForm();
    }

    private _initForm(): void {
        this.authForm = this._fb.group({
            name: this._fb.control('', [Validators.required]),
            last_name: this._fb.control('', [Validators.required]),
            email: this._fb.control('', [Validators.email]),
            password: this._fb.control('', [Validators.required, Validators.minLength(8), Validators.maxLength(64), Validators.pattern(/[A-Za-z0-9]/)]),
            password_rep: this._fb.control('', [Validators.required]),
        }, {
            validators: CustomValidators.validatePasswords
        });
    }

    password_errors(field: 'password' | 'password_rep') {
        const errors = [];
        if (this.authForm?.get(field)?.errors)
            Object.keys(this.authForm.get(field).errors).forEach(key => {
                const err = this.authForm.get(field).errors[key];
                if (err.hasOwnProperty('valid') && !err.valid && err.message) {
                    errors.push(err.message);
                }
            });
        this.authForm.updateValueAndValidity();
        return errors.join(', ');
    }

    onSubmit(): void {
        this._authService.signUp(this.authForm.value).subscribe({
            next: (response: User) => {
                this._router.navigate(['/home', 'dashboard']);
            },
            error: (err: object) => {
                console.error(`Error registering!`, err);
            }
        });
    }

}
