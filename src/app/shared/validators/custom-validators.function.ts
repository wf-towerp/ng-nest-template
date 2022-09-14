import { FormControl, FormArray, FormGroup } from '@angular/forms';

export class CustomValidators {

    static arrayMinLength(length: number) {
        return (c: FormControl) => {
            return (c.value instanceof Array && c.value.length >= length) ? null : {
                arrayMinLength: {
                    valid: false,
                    message: `Value must contain at least ${length} element!`
                }
            };
        };
    }

    static requiredNumber(c: FormControl) {
        return (typeof c.value === 'number' && c.value) ? null : {
            requiredNumber: {
                valid: false,
                message: 'This field must be a valid number > 0!'
            }
        };
    }

    static email(c: FormControl) {
        const EMAIL_REGEXP: RegExp = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

        return (!c.value || EMAIL_REGEXP.test(c.value)) ? null : {
            validate_email: {
                valid: false,
                message: 'Enter valid email address!'
            }
        };
    }

    static ipAddress(c: FormControl) {
        const IP_REGEXP: RegExp = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/i;

        return (!c.value || IP_REGEXP.test(c.value)) ? null : {
            validate_ip: {
                valid: false,
                message: 'Enter valid ip address! (255.255.255.255)'
            }
        };
    }

    static isInteger(c: FormControl) {
        const INTEGER_REGEXP: RegExp = /^[0-9]+$/;

        return (!c.value || INTEGER_REGEXP.test(c.value)) ? null : {
            validate_integer: {
                valid: false,
                message: 'Entered value is not an integer!'
            }
        };
    }

    static isNumber(c: FormControl) {
        return (!c.value || !isNaN(c.value)) ? null : {
            validate_number: {
                valid: false,
                message: c.value.indexOf(',') > -1 ? 'You have to use "." as decimal point!' : 'Value is not a number!'
            }
        };
    }

    static notSpaces(c: FormControl) {
        return (!c.value || (c.value !== '' && c.value.replace(/\s{1,}/g, '') !== '')) ? null : {
            validate_not_string_of_spaces: {
                valid: false,
                message: 'Value is string of spaces!'
            }
        };
    }

    static noCyrillicChars(c: FormControl) {
        return c.value && /[\u0400-\u04FF]/gi.test(c.value) ? {
            validate_no_cyrillic_chars: {
                valid: false,
                message: 'Value contains cyrillic characters!'
            }
        } : null;
    }

    static validatePasswords(c: FormGroup) {
        const pass_value = c?.get('password')?.value;
        const pass_rep_value = c?.get('password_rep')?.value;
        if ((pass_value && pass_rep_value && pass_value !== pass_rep_value)) {
            const error_message = {
                passwords_not_match: {
                    valid: false,
                    message: `Passwords doesn't match!`
                }
            };
            return error_message;
        } else {
            return null;
        }
    }
}
