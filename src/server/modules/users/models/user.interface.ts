export interface IUser {

    id?: number;
    name: string;
    last_name: string;
    avatar?: string;
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

    serialize?(): IUser;

}
