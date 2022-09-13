import { Transform, Type } from 'class-transformer';
import { IsBoolean, IsDate, IsNumber, IsOptional, IsString, MaxLength, MinLength, ValidateIf } from 'class-validator';
import { IUser } from '../models';

export class UserCreateDto  implements IUser {
    
    @IsString()
    @MinLength(2)
    @MaxLength(50)
    name: string;

    @IsString()
    @MinLength(2)
    @MaxLength(50)
    last_name: string;

    @IsOptional()
    @IsString()
    avatar?: string;

    @IsString()
    @MinLength(4)
    @MaxLength(50)
    email: string;

    @IsOptional()
    @IsString()
    @MinLength(8)
    @MaxLength(50)
    password?: string;

    @IsBoolean()
    enabled?: boolean;

    @IsOptional()
    @IsString()
    @MaxLength(5)
    interface_language?: string;

}
