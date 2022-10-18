import { IUser } from './user.interface';

export class User implements IUser {

    id: number;
    name: string;
    last_name: string;
    avatar?: string;
    readonly avatar_path = `/public/profile-images`; // TODO: get from environment variable
    email?: string;
    password?: string;
    salt?: string;
    enabled?: boolean;
    interface_language?: string;
    created_at?: Date;
    updated_at?: Date;
    prev_login?: Date;
    last_login?: Date;
    iat?: number;
    exp?: number;
    accessToken?: string;
    remember_me?: boolean;

    constructor(data?: IUser) {
        if (data) {
            if (data.hasOwnProperty('id')) this.id = data['id'];
            if (data.hasOwnProperty('name')) this.name = data['name'];
            if (data.hasOwnProperty('last_name')) this.last_name = data['last_name'];
            if (data.hasOwnProperty('avatar')) this.avatar = data['avatar'];
            if (data.hasOwnProperty('email')) this.email = data['email'];
            if (data.hasOwnProperty('password')) this.password = data['password'];
            if (data.hasOwnProperty('salt')) this.salt = data['salt'];
            if (data.hasOwnProperty('enabled')) this.enabled = data['enabled'];
            if (data.hasOwnProperty('interface_language')) this.interface_language = data['interface_language'];
            if (data.hasOwnProperty('created_at')) this.created_at = new Date(data['created_at']);
            if (data.hasOwnProperty('updated_at')) this.updated_at = new Date(data['updated_at']);
            if (data.hasOwnProperty('prev_login')) this.prev_login = new Date(data['prev_login']);
            if (data.hasOwnProperty('last_login')) this.last_login = new Date(data['last_login']);
            if (data.hasOwnProperty('iat')) this.iat = data['iat'];
            if (data.hasOwnProperty('exp')) this.exp = data['exp'];
            if (data.hasOwnProperty('accessToken')) this.accessToken = data['accessToken'];
            if (data.hasOwnProperty('remember_me')) this.remember_me = data['remember_me'];
        }
    }

    get full_name() {
        return `${this.name} ${this.last_name}`;
    }

    get avatar_full_path() {
        if (this.avatar?.startsWith('data:'))
            return this.avatar;
        return this.avatar ? `${this.avatar_path}${this.avatar_path.endsWith('/') ? '' : '/'}${this.avatar}` : '';
    }

    get logged_at(): Date {
        return this.iat ? new Date(this.iat * 1000) : null;
    }

    get logged_until(): Date {
        return this.exp ? new Date(this.exp * 1000) : null;
    }

    get logged_for(): number {
        return this.iat ? Math.floor(new Date().getTime() / 1000) - this.iat : 0;
    }

    get logged_left(): number {
        return this.exp ? this.exp - Math.floor(new Date().getTime() / 1000) : 0;
    }

    get logged_duration(): number {
        return this.exp & this.iat ? this.exp - this.iat : 0;
    }

    get logged_refresh(): Date {
        if (this.iat && this.exp) {
            let seconds_before: number = 120;
            if (this.logged_left <= 120)
                seconds_before = Math.round(this.logged_left / 3);
            return new Date(new Date().getTime() + ((this.logged_left * 1000) - (seconds_before * 1000)));
        }
        return null;
    }

}
