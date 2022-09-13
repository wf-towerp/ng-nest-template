import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { AuthController } from './auth.controller';
import { UsersService } from './services/users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersRepository } from './repositories';
import { UserEntity } from './entities';
import { JwtModule } from '@nestjs/jwt';
import { JWTConfig } from '@server/config';

@Module({
    controllers: [
        UsersController,
        AuthController
    ],
    imports: [
        TypeOrmModule.forFeature([
            UsersRepository,
            UserEntity,
        ]),
        JwtModule.register({
            secret: JWTConfig.secret,
            signOptions: {
                expiresIn: JWTConfig.expiresIn
            }
        }),
    ],
    providers: [
        UsersService,
    ],
    exports: [
        UsersService,
    ]
})
export class UsersModule { }
