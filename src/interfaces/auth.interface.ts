import { Request } from 'express';
import { User } from '@interfaces/users.interface';

export interface DataStoredInToken {
  id: number;
  email: string;
  walletAddress: string;
}

export interface TokenData {
  token: string;
  expiresIn: number;
}

export interface RequestWithUser extends Request {
  user: User;
}
