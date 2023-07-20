import { IsNotEmpty, IsString } from  'class-validator';

export class SiteNameDto {

    @IsString()
    @IsNotEmpty()
    readonly sitename: string;

}