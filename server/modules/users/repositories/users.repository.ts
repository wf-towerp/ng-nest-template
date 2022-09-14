import { EntityRepository, Repository } from 'typeorm';
import { SignInDto, SignUpDto } from '../dto';
import { UserEntity } from '../entities';
import { IUser, User } from '../models';
import bcrypt from 'bcrypt';
import { ConflictException, InternalServerErrorException } from '@nestjs/common';

@EntityRepository(UserEntity)
export class UsersRepository extends Repository<UserEntity> {

    async signUp(signUpDto: SignUpDto): Promise<IUser> {
        const { name, last_name, email, password } = signUpDto;
        const user = new UserEntity();
        user.name = name;
        user.last_name = last_name;
        user.email = email;
        user.last_login = new Date();
        user.salt = await bcrypt.genSalt();
        user.password = await bcrypt.hash(password, user.salt);

        try {
            await user.save();
            return new User(user.serialize());
        } catch (error: any) {
            console.error(`Error saving user:`, error);
            if (error.code === '23505') {
                throw new ConflictException('Username already exists!');
            } else {
                throw new InternalServerErrorException(error);
            }
        }
    }

    async validateUserPassword(credentialsDto: SignInDto): Promise<IUser | null> {
        const { email, password } = credentialsDto;
        const user = await this.findOne({ email });

        if (user && await user.validatePassword(password)) {
            return user.serialize();
        } else {
            return null;
        }
    }

}
