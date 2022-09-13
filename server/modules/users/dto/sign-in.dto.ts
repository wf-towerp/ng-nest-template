import { Transform } from 'class-transformer';
import { IsString, MaxLength, MinLength } from 'class-validator';

export class SignInDto {

    @IsString()
    @MinLength(4)
    @MaxLength(255)
    email!: string;

    @IsString()
    @MinLength(4)
    @MaxLength(255)
    password!: string;

    @Transform((value) => typeof value === 'boolean' ? value : value === 'true')
    remember_me?: boolean;

}
