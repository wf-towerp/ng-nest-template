import { BadRequestException, Body, Controller, ForbiddenException, Get, Post, Res } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JWTConfig } from '@server/config';
import { GetRequesterToken } from '@server/tools';
import { Response } from 'express';
import { SignInDto, SignUpDto } from './dto';
import { UserEntity } from './entities';
import { IUser, User } from './models';
import { UsersService } from './services';

@Controller('auth')
export class AuthController {

    constructor(
        private _jwtService: JwtService,
        private _usersService: UsersService,
    ) { }

    @Get('')
    async checkLogggedIn(
        @GetRequesterToken() token: string,
    ): Promise<IUser> {
        // if (!token)
            return null;

        // try {
        //     const user: IUser = this._jwtService.verify<IUser>(token);
        //     if (user) {
        //         const db_user: UserEntity = await this._usersService.view(user.id);
        //         Object.keys(db_user.serialize()).forEach(key => {
        //             user[key] = db_user[key];
        //         });

        //         return new User({
        //             ...db_user.serialize(),
        //             accessToken: token
        //         });
        //     } else
        //         throw new ForbiddenException(`User doesn't exist!`);
        // } catch (error) {
        //     return null;
        // }
    }

    @Post('sign-up')
    signUp(
        @Body() signUpDto: SignUpDto
    ): Promise<IUser> {
        return this._usersService.signUp(signUpDto);
    }

    @Post('sign-in')
    async signIn(
        @Res() response: Response,
        @Body() credentials: SignInDto,
    ) {
        const user = await this._usersService.signIn({ ...credentials });

        const token = await this._jwtService.signAsync({ ...credentials }, {
            expiresIn: credentials.remember_me ? JWTConfig.expiresInRememberMe : JWTConfig.expiresIn
        });
        const token_data: IUser = this._jwtService.verify(token);
        const expires = new Date(token_data.exp * 1000);
        response.cookie('auth', token, { httpOnly: true, expires, sameSite: 'strict' });

        response.json(user);
        return response;
    }

    @Post('sign-out')
    async logOut(
        @Res() response: Response,
    ) {
        const expires = new Date();
        expires.setMinutes(expires.getHours() - 1);
        response.cookie('auth', '', { httpOnly: true, expires, sameSite: 'strict' });

        response.json({});
        return response;
    }

    @Post('renew-token')
    renewToken(
        @GetRequesterToken() token: string,
    ) {
        if (!token)
            throw new BadRequestException('Invalid request!');

        return this._usersService.renewToken(token);
    }

}
