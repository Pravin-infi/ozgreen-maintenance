import { IsNotEmpty, IsString } from  'class-validator';

export class IssueNotesDto {

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