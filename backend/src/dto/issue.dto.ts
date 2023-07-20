import { IsNotEmpty, IsString } from  'class-validator';
import { User } from '../auth/schemas/auth.schemas';


export class IssueDto {

    @IsString()
    @IsNotEmpty()
    readonly site_name: string;

    @IsString()
    @IsNotEmpty()
    readonly timestamp: string;

    @IsString()
    @IsNotEmpty()
    readonly user_id: string;

    @IsString()
    @IsNotEmpty()
    readonly postedByName: string;

    //postedByName

}