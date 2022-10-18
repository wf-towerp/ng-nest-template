import { IsString, MaxLength, MinLength } from 'class-validator';

export class SignUpDto {
    
    @IsString()
    @MinLength(2)
    @MaxLength(50)
    name: string;
    
    @IsString()
    @MinLength(2)
    @MaxLength(50)
    last_name: string;
    
    @IsString()
    @MinLength(4)
    @MaxLength(50)
    email: string;

    @IsString()
    @MinLength(4)
    @MaxLength(50)
    password: string;

}
