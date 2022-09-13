import { IsBoolean, IsNumber, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import { IUser } from '../models';

export class UserUpdateDto  implements IUser {

    @IsNumber()
    id: number;

    @IsOptional()
    @IsString()
    @MinLength(2)
    @MaxLength(50)
    name: string;

    @IsOptional()
    @IsString()
    @MinLength(2)
    @MaxLength(50)
    last_name: string;

    @IsOptional()
    @IsString()
    avatar: string;

    @IsOptional()
    @IsString()
    @MinLength(8)
    @MaxLength(50)
    password: string;

    @IsBoolean()
    enabled?: boolean;

    @IsOptional()
    @IsString()
    @MaxLength(5)
    interface_language?: string;
}