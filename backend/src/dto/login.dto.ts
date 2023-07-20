import { IsNotEmpty, IsString, MinLength } from  'class-validator';

export class LoginDto {

    @IsString()
    @IsNotEmpty()
    readonly username: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(5)
    readonly password: string;

}
