import { IsNotEmpty, IsString } from  'class-validator';

export class UploadDto {

    @IsString()
    @IsNotEmpty()
    readonly notes: string;

    @IsString()
    @IsNotEmpty()
    readonly issue_id: string;

    @IsString()
    @IsNotEmpty()
    readonly user_id: string;

}