import {
    BadRequestException,
    Body,
    Controller,
    Delete,
    Get,
    NotImplementedException,
    Param,
    ParseIntPipe,
    Patch,
    Post,
    Query
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { GetRequesterTenant, GetRequesterToken } from '@server/tools';
import { UserCreateDto } from './dto';
import { UserUpdateDto } from './dto/user-update.dto';
import { IUser, User } from './models';
import { UsersService } from './services';

@Controller('users')
export class UsersController {

    constructor(
        private _jwtService: JwtService,
        private _usersService: UsersService,
    ) { }

    @Get('')
    list(): Promise<IUser[]> {
        return this._usersService.list();
    }

    @Get('my-data')
    async myData(
        @GetRequesterToken() token: string,
        @GetRequesterTenant() tenant: string
    ): Promise<IUser> {
        if (!token)
            throw new BadRequestException('Invalid request!');

        try {
            const user: IUser = this._jwtService.verify<IUser>(token);

            if (user) {
                const db_user = await this._usersService.view(user.id, tenant);
                return new User({
                    ...db_user,
                    ...user
                });
            } else
                throw new BadRequestException('Invalid request!');
        } catch (error) {
            throw new BadRequestException('Invalid request!');
        }
    }

    @Get(':id')
    view(@Param('id', ParseIntPipe) id: number): Promise<IUser> {
        return this._usersService.view(id);
    }

    @Post()
    create(@Body() userDataDto: UserCreateDto): Promise<IUser> {
        return this._usersService.create(userDataDto);
    }

    @Patch()
    update(@Body() userDataDto: UserUpdateDto): Promise<IUser> {
        return this._usersService.update(userDataDto);
    }

    @Delete(':id')
    destroy(@Param('id', ParseIntPipe) id: number) {
        return new NotImplementedException('Deleting data is not implemented!');
    }

}
