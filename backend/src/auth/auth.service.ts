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

@Injectable()
export class AuthService {
    constructor(
        @Inject('MAILER') private readonly mailer: Transporter,
        @InjectModel(User.name)
        private userModel: Model<User>,
        private jwtService: JwtService,
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
    
      
      

    
}
