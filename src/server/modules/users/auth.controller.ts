import { BadRequestException, Body, Controller, ForbiddenException, Get, Post, Res } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JWTConfig } from '@server/config';
import { GetRequesterTenant, GetRequesterToken } from '@server/tools';
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
        @GetRequesterTenant() tenant: string
    ): Promise<IUser> {
        if (!token)
            return null;

        try {
            const user: IUser = this._jwtService.verify<IUser>(token);
            if (user) {
                const db_user: UserEntity = await this._usersService.view(user.id, tenant);
                Object.keys(db_user.serialize()).forEach(key => {
                    user[key] = db_user[key];
                });

                return new User({
                    ...db_user.serialize(),
                    accessToken: token
                });
            } else
                throw new ForbiddenException(`User doesn't exist!`);
        } catch (error) {
            return null;
        }
    }

    @Post('sign-up')
    async signUp(
        @Res() response: Response,
        @Body() credentials: SignUpDto,
        @GetRequesterTenant() tenant: string
    ) {
        const user = await this._usersService.signUp(credentials, tenant);

        const res = await this._setResponseCookie({ ...credentials, remember_me: false }, tenant, response);
        res.json(user);

        return res;
    }

    @Post('sign-in')
    async signIn(
        @Res() response: Response,
        @Body() credentials: SignInDto,
        @GetRequesterTenant() tenant: string
    ) {
        const user = await this._usersService.signIn({ ...credentials }, tenant);

        const res = await this._setResponseCookie(credentials, tenant, response);
        res.json(user);

        return res;
    }

    private async _setResponseCookie(credentials: SignInDto, tenant, response: Response) {
        const token = await this._jwtService.signAsync({ ...credentials, tenant }, {
            expiresIn: credentials.remember_me ? JWTConfig.expiresInRememberMe : JWTConfig.expiresIn
        });
        const token_data: IUser = this._jwtService.verify(token);
        const expires = new Date(token_data.exp * 1000);
        response.cookie('auth', token, { httpOnly: true, expires, sameSite: 'strict' });

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
