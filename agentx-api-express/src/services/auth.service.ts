import { compare, hash } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import { Service } from 'typedi';
import { EntityRepository, Repository } from 'typeorm';
import { SECRET_KEY } from '@config';
import { UserEntity } from '@entities/users.entity';
import { OAuth2Client } from 'google-auth-library';
import { HttpException } from '@/exceptions/httpException';
import { DataStoredInToken, TokenData } from '@interfaces/auth.interface';
import { User } from '@interfaces/users.interface';
import { encrypt } from '@/utils/encrypter';
import { generatePrivateKey, privateKeyToAccount } from 'viem/accounts';

const createToken = (user: User): TokenData => {
  const dataStoredInToken: DataStoredInToken = { id: user.id, email: user.email, walletAddress: user.walletAddress };
  const secretKey: string = SECRET_KEY;
  const expiresIn: string | number = 30*24*60*60;// '30d';// 60 * 60;

  return { expiresIn, token: sign(dataStoredInToken, secretKey, { expiresIn }) };
}

const createCookie = (tokenData: TokenData): string => {
  return `Authorization=${tokenData.token}; HttpOnly; Max-Age=${tokenData.expiresIn};`;
}

@Service()
@EntityRepository()
export class AuthService extends Repository<UserEntity> {
  googleOauthClient: OAuth2Client = new OAuth2Client(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
  );

  public async signup(userData: User): Promise<User> {
    const findUser: User = await UserEntity.findOne({ where: { email: userData.email } });
    if (findUser) throw new HttpException(409, `This email ${userData.email} already exists`);

    const hashedPassword = await hash(userData.password, 10);
    const createUserData: User = await UserEntity.create({ ...userData, password: hashedPassword }).save();
    return createUserData;
  }

  public async login(userData: User): Promise<{ cookie: string; findUser: User }> {
    const findUser: User = await UserEntity.findOne({ where: { email: userData.email } });
    if (!findUser) throw new HttpException(409, `This email ${userData.email} was not found`);

    const isPasswordMatching: boolean = await compare(userData.password, findUser.password);
    if (!isPasswordMatching) throw new HttpException(409, "Password not matching");

    const tokenData = createToken(findUser);
    const cookie = createCookie(tokenData);

    return { cookie, findUser };
  }

  public async loginWithGoogle(googleIdToken: string): Promise<{ cookie: string; user: User; walletSecret: string;token: TokenData; }> {

    const ticket = await this.googleOauthClient.verifyIdToken({
      idToken: googleIdToken,
      audience: process.env.GOOGLE_CLIENT_ID
    })
    // console.log('ticket', ticket.getPayload() );
    const { email, name,  } = ticket.getPayload();
    // console.log('ticket deconstr', email, name );
    
    let user = await UserEntity.findOne({ where: { normalizedEmail: email.trim().toUpperCase() } });

    let privateKey: any = ''
    if(!user){
      privateKey = generatePrivateKey()

      const newUser = UserEntity.create();
      newUser.email = email.trim(),
      newUser.normalizedEmail = email.trim().toUpperCase(),
      newUser.walletSecret = encrypt( privateKey),
      newUser.walletAddress = privateKeyToAccount(privateKey).address
      // const createUserData: User = await UserEntity.create({ ...userData, password: hashedPassword }).save();
      user = await newUser.save();
    }else{
      //dont return privateKey

    }
  

    const tokenData = createToken(user);
    const cookie = createCookie(tokenData);

    return { token:tokenData, cookie, user, walletSecret: privateKey };
  }

  public async logout(userData: User): Promise<User> {
    const findUser: User = await UserEntity.findOne({ where: { email: userData.email, password: userData.password } });
    if (!findUser) throw new HttpException(409, "User doesn't exist");

    return findUser;
  }
}
