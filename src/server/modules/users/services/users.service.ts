import { Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JWTConfig } from '@server/config';
import { Superadmin } from '@server/config/initial-user.config';
import { SignInDto, SignUpDto, UserCreateDto } from '../dto';
import { UserUpdateDto } from '../dto/user-update.dto';
import { UserEntity } from '../entities';
import { IUser, User } from '../models';
import { UsersRepository } from '../repositories';

@Injectable()
export class UsersService {

    constructor(
        private _jwtService: JwtService,
        private _usersRepository: UsersRepository,
    ) {
        // this._checkAvailableUsers();
    }

    private async _checkAvailableUsers() {
        const users = await this._usersRepository.count();
        if (!users) {
            const admin = await this.signUp(Superadmin, 'public');
            const user: UserEntity = await this.view(admin.id);
            await user.save();
        }
    }

    async list() {
        return [];
    }

    async view(id: number, tenant: string = 'public') {
        return this._usersRepository.view({ id }, tenant);
    }

    async create(userDataDto: UserCreateDto): Promise<IUser> {
        return new User();
    }

    async update(userDataDto: UserUpdateDto): Promise<IUser> {
        return new User();
    }

    async delete(id: number) {

    }

    async signUp(signUpDto: SignUpDto, tenant: string): Promise<IUser> {
        return this._usersRepository.signUp(signUpDto, tenant);
    }

    async signIn(credentials: SignInDto, tenant: string): Promise<IUser> {
        const payload = await this._usersRepository.validateUserPassword(credentials, tenant);

        if (!payload)
            throw new UnauthorizedException('Invalid credentials!');

        const access_token = await this._jwtService.signAsync(
            {
                ...payload,
                tenant
            },
            {
                expiresIn: credentials.remember_me ? JWTConfig.expiresInRememberMe : JWTConfig.expiresIn
            }
        );

        let user: IUser = this._jwtService.verify<IUser>(access_token);

        if (user) {
            const db_user = await this.view(user.id, tenant);

            db_user.prev_login = db_user.last_login;
            db_user.last_login = new Date();

            try {
                await db_user.save();
            } catch (error) {
                throw new InternalServerErrorException(error);
            }

            user = new User({
                ...user,
                ...db_user.serialize()
            });

            user.accessToken = access_token;

            return user;
        } else
            throw new UnauthorizedException('Credentials verification failed!');
    }

    async renewToken(token: string) { }

}
