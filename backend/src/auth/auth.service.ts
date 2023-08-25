import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/auth.schemas';
import { Model } from 'mongoose';
import { ObjectId } from 'bson';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { SignUpDto } from 'src/dto/signup.dto';
import { LoginDto } from 'src/dto/login.dto';
import { Transporter } from 'nodemailer';
import { VerifyDto } from 'src/dto/verify.dto';
import { ResetToken } from './schemas/reset-token.schema'; // Import the ResetToken model
import * as crypto from 'crypto';

@Injectable()
export class AuthService {
    constructor(
        @Inject('MAILER') private readonly mailer: Transporter,
        @InjectModel(User.name)
        private userModel: Model<User>,
        private jwtService: JwtService,
        @InjectModel(ResetToken.name) private  resetTokenModel: Model<ResetToken>,
    ){}

    async signUp(signUpDto: SignUpDto): Promise<{ token: string }> {
      
      const { name, username, password, email, usertype, verifycode } = signUpDto;
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await this.userModel.create({
        name,
        username,
        email,
        status: signUpDto.status, // Pass the status property from the SignUpDto
        verifycode,
        usertype,
        password: hashedPassword,
      });
    const token = this.jwtService.sign({id: user._id})

    return { token }
    }



    async login(loginDto: LoginDto) {
        const { username, password } = loginDto;

        const user = await this.userModel.findOne({ username })

        if(!user){
            throw new UnauthorizedException('Invalid username')
        }
        const isPasswordMatched = await bcrypt.compare(password, user.password )

        if(!isPasswordMatched){
            throw new UnauthorizedException('Invalid username')
        }

        if(user.status === false){
          throw new UnauthorizedException('Invalid Login Account is Inactive ')
        }

        if (user.usertype === "Admin") {
          const token = this.jwtService.sign({ id: user._id });
          const res = { token, userid: user._id, username: user.name, usertype: user.usertype };
          return res;
        }

        const code = Math.floor(100000 + Math.random() * 900000).toString();
        const to = user.email
        const subject = 'OTP for GCW site mainetatnce portal'
        //const body = 'Code is '+ code
        const htmlContent = `
            <p>Hi,</p>
            <p>Code is ${code}</p>
            <p>Thanks,</p>
            <p>Reporting team</p>`;

        const mailOptions = {
            from: 'pravin@infinitysoftsystems.com',
            to,
            subject,
            html: htmlContent
          };
      
        await this.mailer.sendMail(mailOptions);
        
        await this.userModel.updateOne({ _id: user._id }, { verifycode: code });      

        const res = { userid: user._id, usertype: user.usertype,}       

        return res
    }

    async sendEmail(to: string, subject: string, body: string): Promise<void> {
        const mailOptions = {
          from: 'pravin@infinitysoftsystems.com',
          to,
          subject,
          text: body,
        };
    
        await this.mailer.sendMail(mailOptions);
    }


    async verifyEmailCode(verifyDto: VerifyDto) {            
        try { 
          const { userid, code } = verifyDto 
          const issueObjectId = new ObjectId(userid);
          const user = await this.userModel.findOne({ _id:issueObjectId });
      
          if (!user) {
            throw new Error('User not found');
          }
      
          if (user.verifycode !== code) {
            throw new Error('Invalid verify code');
          }
      
          const token = this.jwtService.sign({ id: user._id });
          const res = { token, userid: user._id, username: user.name };
      
          return res;
        } catch (error) {
          throw new Error('Verification failed: ' + error.message);
        }
    }

    async findAll() {
      const res = await this.userModel.find().sort({ _id: -1 });
      return res;
    }


    async findById(id) {
      const user = await this.userModel.findOne({ _id: id });
      if(user.status==false) {
        await this.userModel.updateOne({ _id: user._id }, { status: true });
      }else{
        await this.userModel.updateOne({ _id: user._id }, { status: false });
      }
      return user;
    }
    


    // visahl code

    async findByEmail( email: string): Promise<User | null> {
      return this.userModel.findOne({ email }).exec();
    }

      

    async generateResetToken(userId: string) {
     
      const expiresAt = new Date();
      expiresAt.setMinutes(expiresAt.getMinutes() + 15);
      const token = crypto.randomBytes(20).toString('hex');
      
      const resetToken = new this.resetTokenModel({
        userId,
        token,
        expiresAt,
      });
      return resetToken.save();
    }


    async validateResetToken(token: string): Promise<ResetToken | null> {
      return this.resetTokenModel.findOne({ token, expiresAt: { $gt: new Date() } }).exec();
    }
  
    async resetPassword(token: string, newPassword: string): Promise<void> {
      const resetToken = await this.validateResetToken(token);
      const user = await this.userModel.findById(resetToken.userId).exec();
    
      if (!user) {
        throw new Error('User not found');
      }
  
      // // Update the user's password and delete the reset token
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      user.password = hashedPassword;
      await user.save();
      const a=await resetToken.deleteOne();
      console.log(a);
      



    }


    // sent mail


    async sentMailForResetPassword(resetLink:string,name:string,email:string ): Promise<void>{
      try {
        //  const issueObjectId = new ObjectId(req.issueId);        
    
          const to = email;
          const subject ="Reset Password"
          const htmlContent = `
          <p>Hi ${name},</p>
          <p>You can reset your  password by clicking the link below. For increased security, this password reset link will expire in 15 minutes after it was sent.</p>
          <br />
          <a href=${resetLink}>Reset Password</button>
          <br />
          <p>Thanks</p>`;
          
          const mailOptions = {
              from: 'pravin@infinitysoftsystems.com',
              to,
              subject,
              html: htmlContent,
            };
            
          return await this.mailer.sendMail(mailOptions);
  
      } catch (error) {
        // Handle the error
        console.error(error);
        return null;
      }
    }
        
}
