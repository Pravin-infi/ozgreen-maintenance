import { Body, Controller, Post, Get, BadRequestException, Param } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from 'src/dto/signup.dto';
import { LoginDto } from 'src/dto/login.dto';
import { VerifyDto } from 'src/dto/verify.dto';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Get(':id')
    async getUser( @Param('id') id: string ) {
        return this.authService.findById(id);
    }

    @Get()
    async getAllUser() {
        return await this.authService.findAll();
    }

    @Post('/signup')
    signUp(@Body() signUpDto: SignUpDto): Promise<{ token: string}> {
        return this.authService.signUp(signUpDto);
    }

    @Post('/login')
    async login(@Body() loginDto: LoginDto) {
        return this.authService.login(loginDto);
    }

    @Post('/email')
    async createUser(): Promise<void> {
        await this.authService.sendEmail('demo8@yopmail.com', 'OTP for GCW site mainetatnce portal', 'Hello, World!');;
    }

    @Post('/emailVerify')
    async verifyCode(@Body() verifyDto: VerifyDto) {
    try {
        const result = await this.authService.verifyEmailCode(verifyDto);
        return result;
    } catch (error) {
        throw new BadRequestException('Email verification failed: ' + error.message);
    }
    }

}
