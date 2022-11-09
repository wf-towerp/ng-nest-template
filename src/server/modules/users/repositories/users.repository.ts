import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { SignInDto, SignUpDto } from '../dto';
import { UserEntity } from '../entities';
import { IUser, User } from '../models';
import bcrypt from 'bcrypt';
import { ConflictException, InternalServerErrorException } from '@nestjs/common';
import { TenantsService } from '@server/core/multi-tenant';
import { Logger } from '@nestjs/common/services'

@Injectable()
export class UsersRepository extends Repository<UserEntity> {

    logger: Logger = new Logger('UsersRepository');

    constructor(
        private _dataSource: DataSource,
        private _tenantsService: TenantsService
    ) {
        super(UserEntity, _dataSource.createEntityManager());
    }

    async view(where: object, tenant: string): Promise<UserEntity> {
        const connection = await this._tenantsService.getConnection(tenant);
        const manager = connection.createEntityManager();

        return await manager.findOne(UserEntity, { where });
    }

    async signUp(signUpDto: SignUpDto, tenant: string = 'public'): Promise<IUser> {
        const { name, last_name, email, password } = signUpDto;
        const user = new UserEntity();
        user.name = name;
        user.last_name = last_name;
        user.email = email;
        user.last_login = new Date();
        user.salt = await bcrypt.genSalt();
        user.password = await bcrypt.hash(password, user.salt);

        const connection = await this._tenantsService.getConnection(tenant);
        const manager = connection.createEntityManager();

        try {
            await manager.save(user);
            return new User(user.serialize());
        } catch (error: any) {
            this.logger.error(`Error saving user:`, error)
            if (error.code === '23505')
                throw new ConflictException('Username already exists!');
            else
                throw new InternalServerErrorException(error);
        }
    }

    async validateUserPassword(credentialsDto: SignInDto, tenant: string): Promise<IUser | null> {
        const { email, password } = credentialsDto;

        const user = await this.view({ email }, tenant);

        if (user && await user.validatePassword(password))
            return user.serialize();
        else
            return null;
    }

}
