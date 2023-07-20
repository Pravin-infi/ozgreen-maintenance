import { IsNotEmpty, IsString, MinLength } from  'class-validator';

export class VerifyDto {

    @IsString()
    @IsNotEmpty()
    readonly userid: string;

    @IsNotEmpty()
    @MinLength(6)
    readonly code: string;

}
