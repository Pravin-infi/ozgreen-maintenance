import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { UserSchema } from './schemas/auth.schemas';
import { JwtStrategy } from './jwt.strategy';
import { EmailModule } from './email.module';
import { ResetTokenSchema } from './schemas/reset-token.schema';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt'}),
    JwtModule.registerAsync({
      inject: [ ConfigService ],
      useFactory: (config: ConfigService ) => {
        return {
          secret: config.get<string>('JWT_SECRET'),
          signOptions: {
            expiresIn: config.get<string | number>('JWT_EXPIRES'),
          }
        }
      },
    }),
    MongooseModule.forFeature([{name: 'User', schema: UserSchema}]),
    MongooseModule.forFeature([{name: 'ResetToken', schema: ResetTokenSchema}]),
    EmailModule
  ],
  providers: [AuthService, JwtStrategy],
  exports: [JwtStrategy, PassportModule],
  controllers: [AuthController]
})
export class AuthModule {}
