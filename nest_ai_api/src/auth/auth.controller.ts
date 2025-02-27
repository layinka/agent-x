import { Body, ClassSerializerInterceptor, Controller, Post, Req, UseInterceptors } from '@nestjs/common';
import { AuthService } from './auth.service';
import TokenVerificationDto from 'src/DTOs/token-verification-dto';

@UseInterceptors(ClassSerializerInterceptor)
@Controller('auth')
export class AuthController {

    constructor(
        private readonly authService: AuthService
    ) {

    }
    
  @Post()
  async loginWithGoogle(@Body() tokenData: TokenVerificationDto, @Req() request: Request) {
    const userDetails = await this.authService.authenticate(tokenData.token);
    console.log('userDetails 1:', userDetails );
    return userDetails;
  }
}


