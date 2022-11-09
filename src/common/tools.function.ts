import { environment } from '@env/environment';

const months_full = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
];

const months_short = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
];

const UPPERCASE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const LOWERCASE = 'abcdefghijklmnopqrstuvwxyz';
const DIGITS = '0123456789';
const SPECIAL = `!@#$%^&*()_+[]{};':",./<>?`;

/* base64 character set, plus padding character (=) */
export const B64: string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
/* Regular expression to check formal correctness of base64 encoded strings */
export const B64RE: RegExp = /^(?:[A-Za-z\d+\/]{4})*?(?:[A-Za-z\d+\/]{2}(?:==)?|[A-Za-z\d+\/]{3}=?)?$/;

export class Tools {

    static readonly API_DOMAIN = `${environment.DOMAIN.endsWith('/') ? environment.DOMAIN.replace(/\/$/, '') : environment.DOMAIN}${environment.PORT ? ':' + environment.PORT : ''}`;
    static readonly API_URL = `${Tools.API_DOMAIN}${environment.API_ROOT.startsWith('/') ? environment.API_ROOT : '/' + environment.API_ROOT}`;

    static formatDate(date: string | Date, format: string): string {
        if (!date)
            return '';

        if (typeof date === 'string')
            date = new Date(date);

        const date_elements = {
            YYYY: date.getFullYear(),
            yyyy: date.getFullYear(),
            yy: date.getFullYear(),
            YY: date.getFullYear().toString().substr(2, 2),
            MMMM: months_full[date.getMonth()],
            MMM: months_short[date.getMonth()],
            MM: ((date.getMonth() + 1 < 10) ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1)),
            M: date.getMonth() + 1,
            DD: ((date.getDate() < 10) ? '0' + date.getDate() : date.getDate()),
            dd: ((date.getDate() < 10) ? '0' + date.getDate() : date.getDate()),
            D: date.getDate(),
            HH: ((date.getHours() < 10) ? '0' + date.getHours() : date.getHours()),
            H: date.getHours(),
            mm: ((date.getMinutes() < 10) ? '0' + date.getMinutes() : date.getMinutes()),
            m: date.getMinutes(),
            ss: ((date.getSeconds() < 10) ? '0' + date.getSeconds() : date.getSeconds()),
            s: date.getSeconds(),
            mss: ((date.getMilliseconds() / 1000).toFixed(3)).split('.').pop(),
        };

        let formatted = format;

        Object.keys(date_elements).forEach(key => {
            formatted = formatted.replace(new RegExp(key, 'g'), date_elements[key]);
        });

        return formatted;
    }

    static generateChecksum(key: string, possible: string): string {
        let checksum: number = 0;

        for (let i = 0; i < key.length; i++)
            checksum += (possible.indexOf(key.charAt(i)) + 1) * (i + 1);

        return checksum.toString(36);
    }

    static generateKey(
        length: number = 6,
        options: {
            uppercase?: boolean,
            lowercase?: boolean,
            digits?: boolean
            special_characters?: boolean,
            checksum?: boolean
        } = {
                uppercase: false,
                lowercase: true,
                digits: true,
                special_characters: false,
                checksum: true
            }
    ) {
        /* Defaults if only one option is provided */
        if (!options.hasOwnProperty('uppercase')) options.uppercase = false;
        if (!options.hasOwnProperty('lowercase')) options.lowercase = true;
        if (!options.hasOwnProperty('digits')) options.digits = true;
        if (!options.hasOwnProperty('special_characters')) options.special_characters = false;
        if (!options.hasOwnProperty('checksum')) options.checksum = true;


        let possible = '';
        if (options?.uppercase) possible = UPPERCASE;
        if (options?.lowercase) possible += LOWERCASE;
        if (options?.digits) possible += DIGITS;
        if (options?.special_characters) possible += SPECIAL;

        /* Generate checksum */
        if (options?.checksum) {
            const last_char = possible.charAt(possible.length - 1);
            let max_number: number = 0;
            for (let i = 1; i <= length; i++) {
                max_number += (possible.length - 1) * i;
            }
            const checksum_length = max_number.toString(36).length;
            length -= checksum_length;
        }

        /* Generate key itself */
        let key = '';
        for (let i = 0; i < length; i++)
            key += possible.charAt(Math.floor(Math.random() * possible.length));

        if (options?.checksum) {
            const checksum = Tools.generateChecksum(key, possible);
            key += checksum;
        }

        return key;
    }

    static validateKey(
        key: string,
        options: {
            uppercase?: boolean,
            lowercase?: boolean,
            digits?: boolean
            special_characters?: boolean,
        } = {
                uppercase: false,
                lowercase: true,
                digits: true,
                special_characters: false,
            }
    ) {
        /* Defaults if only one option is provided */
        if (!options.hasOwnProperty('uppercase')) options.uppercase = false;
        if (!options.hasOwnProperty('lowercase')) options.lowercase = true;
        if (!options.hasOwnProperty('digits')) options.digits = true;
        if (!options.hasOwnProperty('special_characters')) options.special_characters = false;

        let possible = '';
        if (options?.uppercase) possible = UPPERCASE;
        if (options?.lowercase) possible += LOWERCASE;
        if (options?.digits) possible += DIGITS;
        if (options?.special_characters) possible += SPECIAL;

        // FIXME: If key is very long and the checksum is > 2 characters
        const checksum = Tools.generateChecksum(key.substring(0, key.length - 2), possible);

        return checksum === key.substring(key.length - 2);
    }

    /**
     * @description Resolve deep object property from string
     * @example Tools.resolveObj(this.planning_task_form.value, 'assignment_lot.materials[0].material_lot.count') resolves the value of "count" property
     * @example Usage of *:
     * 'assignment_lot.materials[*].material_lot.count' resolves all values of materials[n].material_log.count, concatenated with ', '
     * @example Usage of $:
     * 'assignment_lot.materials[$].material_lot.count' resolves value of last element in 'materials'
     * @param object {object} Object to search in
     * @param path {string} Path of the property
     * @param resolve_undefined {boolean} Resolves "undefined" properties as empty string
     */
    static resolveObj(
        object: object = {},
        path: string,
        resolve_undefined: boolean = true
    ): object | string {
        path = path.replace(/\[([\w\*\$]+)\]/g, '.$1').replace(/^\./, '');

        let idx: number = path.indexOf('.');
        if (path.startsWith('*') && Array.isArray(object)) {
            idx = path.indexOf('.');
            if (idx > -1)
                return object.map(x => {
                    return Tools.resolveObj(x, path.substr(idx + 1));
                }).join(', ');

            return object.join(', ');
        } else if (path.startsWith('$') && Array.isArray(object))
            return Tools.resolveObj(object[object.length - 1], path.substr(idx + 1));
        else if (idx > -1)
            return Tools.resolveObj(object[path.substring(0, idx)], path.substr(idx + 1));

        return !object || object[path] === undefined ? (resolve_undefined ? '' : undefined) : object[path];
    }

    static atob(text: string): string {
        /* atob can work with strings with whitespaces, even inside the encoded part,
           but only \t, \n, \f, \r and ' ', which can be stripped. */
        text = String(text).replace(/[\t\n\f\r ]+/g, '');
        if (!B64RE.test(text))
            throw new TypeError('Failed to execute "atob" on "Window": The string to be decoded is not correctly encoded.');

        /* Adding the padding if missing, for semplicity */
        text += '=='.slice(2 - (text.length & 3));
        let bitmap: number,
            result: string = '',
            r1: number,
            r2: number,
            i: number = 0;
        for (; i < text.length;) {
            bitmap = B64.indexOf(text.charAt(i++)) << 18 | B64.indexOf(text.charAt(i++)) << 12
                | (r1 = B64.indexOf(text.charAt(i++))) << 6 | (r2 = B64.indexOf(text.charAt(i++)));

            result += r1 === 64 ? String.fromCharCode(bitmap >> 16 & 255)
                : r2 === 64 ? String.fromCharCode(bitmap >> 16 & 255, bitmap >> 8 & 255)
                    : String.fromCharCode(bitmap >> 16 & 255, bitmap >> 8 & 255, bitmap & 255);
        }
        return result;
    }

    static btoa(text: string): string {
        text = String(text);
        let bitmap: number,
            a: number,
            b: number,
            c: number,
            result: string = '',
            i: number = 0;
        const rest: number = text.length % 3; /* To determine the final padding */

        for (; i < text.length;) {
            if ((a = text.charCodeAt(i++)) > 255
                || (b = text.charCodeAt(i++)) > 255
                || (c = text.charCodeAt(i++)) > 255)
                throw new TypeError('Failed to execute "btoa" on "Window": The string to be encoded contains characters outside of the Latin1 range.');

            bitmap = (a << 16) | (b << 8) | c;
            result += B64.charAt(bitmap >> 18 & 63) + B64.charAt(bitmap >> 12 & 63) + B64.charAt(bitmap >> 6 & 63) + B64.charAt(bitmap & 63);
        }

        /* If there's need of padding, replace the last 'A's with equal signs */
        return rest ? result.slice(0, rest - 3) + '==='.substring(rest) : result;
    }

    static parseCSV(
        csv: string,
        col_names_row_idx: number = 0,
        row_delimiter: string = `\n`,
        col_delimiter: string = `,`,
        string_delimiter: string = `"`
    ): any[] {
        let csv_rows: any[] = csv.split(row_delimiter).map(row => row.replace(/\r$/, '')).filter(row => row.length);

        const regexp = new RegExp(`(${string_delimiter || ''}(.*?)${string_delimiter || ''}|(.*?))(?:${col_delimiter}|$)`, 'g');

        csv_rows = csv_rows.map(row => {
            const matches = row.match(regexp);
            if (matches?.length)
                return matches
                    .map(value => value.replace(regexp, '$1'))
                    .map(value => value.replace(new RegExp(`(?:^\\${string_delimiter})|(?:\\${string_delimiter}$)`, 'g'), ''));
            return null;
        }).filter(row => !!row);

        const result = [];

        return csv_rows.map((row: any[], idx) => {
            const row_data = {};
            if (idx !== col_names_row_idx) {
                row.forEach((value, val_idx) => {
                    row_data[
                        csv_rows[col_names_row_idx][val_idx]
                    ] = ['true', 'false'].includes(value) ? value === 'true' : (!!value && !isNaN(value) && !value.startsWith('+') ? +value : value.trim());
                });
                return row_data;
            }
            return null;
        }).filter(row => !!row);
    }

    static makeId(length?: number) {
        if (!length) length = 5;
        let text = '';
        const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

        for (let i = 0; i < length; i++)
            text += possible.charAt(Math.floor(Math.random() * possible.length));

        return text;
    }

    static toPlural(value: string): string {
        return (value.endsWith('y') ? value.replace(/y$/i, 'ies') : `${value}s`);
    }

    static toSingular(value: string): string {
        return (value.endsWith('ies') ? value.replace(/ies$/i, 'y') : value.replace(/s$/i, ''));
    }

    static toHMS(milliseconds: number, round_ms: number = 0) {
        let seconds = milliseconds / 1000;
        const hours = parseInt((seconds / 3600).toString());
        seconds = seconds % 3600;
        const minutes = parseInt((seconds / 60).toString());
        seconds = seconds % 60;

        const hours_ = hours > 9 ? `${hours}` : `0${hours}`;
        const minutes_ = minutes > 9 ? `${minutes}` : `0${minutes}`;
        const seconds_ = seconds > 9 ? `${seconds.toFixed(round_ms)}` : `0${seconds.toFixed(round_ms)}`;
        return `${hours_}:${minutes_}:${seconds_}`;
    }
}

/**
 * @description Simple Event Emitter class
 */
export class EventEmitter {
    private _events: { [key: string]: ((...args: any[]) => any)[] } = {};

    on(event: string, listener: (...args: any[]) => any): void {
        if (typeof this._events[event] !== 'object')
            this._events[event] = [];

        this._events[event].push(listener);
    }

    off(event?: string, listener?: (...args: any[]) => any): void {
        if (!event)
            this._events = {};
        else if (listener === undefined)
            delete this._events[event];
        else if (this._events[event].indexOf(listener) !== -1) {
            const idx: number = this._events[event].indexOf(listener);
            this._events[event].splice(idx, 1);
        }
    }

    /**
     * @deprecated Method is deprecated in favor of ".off"
     */
    removeListener(event?: string, listener?: (...args: any[]) => any): void {
        this.off(event, listener);
    }

    emit(event: string, ...args: any[]): void {
        if (typeof this._events[event] === 'object')
            this._events[event].forEach(listener => listener.apply(this, args));
    }

    once(event: string, listener: (...args: any[]) => any): void {
        const remove: void = this.on(event, (...args) => {
            this.off(event, listener);
            listener.apply(this, args);
        });
    }
}
