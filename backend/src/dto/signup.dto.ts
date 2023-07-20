import { IsNotEmpty, IsString, MinLength } from  'class-validator';

export class SignUpDto {
    
    @IsString()
    @IsNotEmpty()
    readonly name: string;

    @IsString()
    @IsNotEmpty()
    readonly username: string;

    @IsString()
    @IsNotEmpty()
    readonly email: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(5)
    readonly password: string;

    status: boolean  = false;

    verifycode: string = '';

    usertype: string = 'user';


}
