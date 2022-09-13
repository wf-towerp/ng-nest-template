import { ForbiddenException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JWTConfig } from '@server/config';
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
    ) { }

    async list() {
        return [];
    }

    async view(id: number) {
        return this._usersRepository.findOne(id);
    }

    async create(userDataDto: UserCreateDto): Promise<IUser> {
        return new User();
    }

    async update(userDataDto: UserUpdateDto): Promise<IUser> {
        return new User();
    }

    async delete(id: number) {

    }

    async signUp(signUpDto: SignUpDto): Promise<IUser> {
        return this._usersRepository.signUp(signUpDto);
    }

    async signIn(credentials: SignInDto): Promise<IUser> {
        const payload = await this._usersRepository.validateUserPassword(credentials);

        if (!payload)
            throw new UnauthorizedException('Invalid credentials!');

        const access_token = await this._jwtService.signAsync(
            payload,
            {
                expiresIn: credentials.remember_me ? JWTConfig.expiresInRememberMe : JWTConfig.expiresIn
            }
        );

        let user: IUser = this._jwtService.verify<IUser>(access_token);

        if (user) {
            const db_user = await this.view(user.id);

            if (!db_user.enabled)
                throw new ForbiddenException('Your account has no rights to login! Please, contact the administrator!');

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
