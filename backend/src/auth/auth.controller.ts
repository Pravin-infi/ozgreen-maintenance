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


    @Post('forgot-password')
    async requestPasswordReset(@Body('email') email: string): Promise<void> {

    try{
      // Find the user by email and generate a reset token 
      const user = await this.authService.findByEmail(email);
      if (user) {
        const resetToken = await this.authService.generateResetToken(user._id);
        const resetLink:string=`http://localhost:4200/reset-password/${resetToken.userId}/${resetToken.token}`;
        const name:string=user.name;
        const email:string=user.email;
         return this.authService.sentMailForResetPassword(resetLink,name,email);
        // Send reset token via email to the user
        
      }
      else{
        throw new Error('User not found');
      }

    } catch (error) {
        throw new Error(error.message);
    }

    }

    @Post('/token-verify')
    async verifyToken(@Body('token') token: string){
        try{
            const tokenVerify=await this.authService.validateResetToken(token);
            if(!tokenVerify)
            {
                return { status:false, msg:"Token has been expired or Invalid Token" }
            }else{
                return { status:true, msg:"Token Match" }
            }
        } 
        catch (error) {
            throw new Error( error.message);
        }
    }

    @Post('reset-password/:token')
     async resetPassword(@Param('token') token: string, @Body('password') password: string){

        try{
         const Mytoken=await this.authService.validateResetToken(token);
            if( !Mytoken)
            {  
                return { status:false, msg:"Token has been expired or Invalid Token" }
            }

            await this.authService.resetPassword(token, password);

        
        } 
        catch (error) {
            throw new Error( error.message);
        }

   //  await this.authService.resetPassword(token, password);
      //Password has been successfully reset
    }

}
