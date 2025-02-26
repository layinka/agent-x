import { Injectable, UnauthorizedException } from '@nestjs/common';
import { OAuth2Client } from 'google-auth-library';
import { EncryptionService } from 'src/encryption/encryption.service';
import { UserEntity } from 'src/users/users/user.entity';
import { UsersService } from 'src/users/users/users.service';
import { generatePrivateKey, privateKeyToAccount } from 'viem/accounts';

@Injectable()
export class AuthService {
    googleOauthClient: OAuth2Client = new OAuth2Client(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
    );
  constructor(
    private readonly usersService: UsersService,
    private readonly encryptionService: EncryptionService
    // private readonly configService: ConfigService,
    // private readonly authenticationService: AuthenticationService
  ) {
    // const clientID = this.configService.get('GOOGLE_AUTH_CLIENT_ID');
    // const clientSecret = this.configService.get('GOOGLE_AUTH_CLIENT_SECRET');

    // this.googleOauthClient = new google.auth.OAuth2(
    //   clientID,
    //   clientSecret
    // );
  }

  // async getUserData(token: string) {
  //   const userInfoClient = google.oauth2('v2').userinfo;

  //   this.googleOauthClient.setCredentials({
  //     access_token: token
  //   })

  //   const userInfoResponse = await userInfoClient.get({
  //     auth: this.googleOauthClient
  //   });

  //   return userInfoResponse.data;
  // }

  // async getCookiesForUser(user: User) {
  //   const accessTokenCookie = this.authenticationService.getCookieWithJwtAccessToken(user.id);
  //   const {
  //     cookie: refreshTokenCookie,
  //     token: refreshToken
  //   } = this.authenticationService.getCookieWithJwtRefreshToken(user.id);

  //   await this.usersService.setCurrentRefreshToken(refreshToken, user.id);

  //   return {
  //     accessTokenCookie,
  //     refreshTokenCookie
  //   }
  // }

  async handleRegisteredUser(user: UserEntity) {
    // if (!user.isRegisteredWithGoogle) {
    //   throw new UnauthorizedException();
    // }

    // const {
    //   accessTokenCookie,
    //   refreshTokenCookie
    // } = await this.getCookiesForUser(user);

    // return {
    //   accessTokenCookie,
    //   refreshTokenCookie,
    //   user
    // }
    return user;
  }

  async registerUser(name: string, email: string) {

    const privateKey = generatePrivateKey()
    // console.log('priva key:', process.env.WALLET_PRIVATE_KEY??'No Key in ENV' )
    // console.log('priva key:', privateKey )

    const newUser = new UserEntity();
    newUser.email = email.trim(),
    newUser.normalizedEmail = email.trim().toUpperCase(),
    newUser.walletSecret = this.encryptionService.encrypt( privateKey),
    newUser.walletAddress = privateKeyToAccount(privateKey).address
    
    const user = await this.usersService.create(newUser);
    console.log('newUser:', newUser )

    console.log('savedUser:', user )
    return {
      user: await this.handleRegisteredUser(user),
      privateKey
    } 
  }

  async authenticate(token: string) {
    
    const ticket = await this.googleOauthClient.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID
    })
    console.log('ticket', ticket.getPayload() );
    const { email, name,  } = ticket.getPayload();

    try {
      const user = await this.usersService.getUserByEmail(email);

      return {
        user: await this.handleRegisteredUser(user),
        privateKey: ''
      }
    } catch (error) {
      console.error('Error: ', error)
      if (error && error.status && error.status !== 404) {
        throw new error;
      }

      return await this.registerUser(name, email);
    }
  }


}
