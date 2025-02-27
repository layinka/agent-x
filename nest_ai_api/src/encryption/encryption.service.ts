import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';
import { ConfigService } from '@nestjs/config';




@Injectable()
export class EncryptionService {
  private algorithm = 'aes-256-cbc';
  private secretKey: string;
  private ivLength = 16;

  constructor(private configService: ConfigService) {
    // Get key from environment variables
    this.secretKey = this.configService.get<string>('ENCRYPTION_KEY');
    if (!this.secretKey || this.secretKey.length !== 32) {
      throw new Error('ENCRYPTION_KEY must be 32 characters long');
    }
  }

  encrypt(text: string): string {
    const iv = crypto.randomBytes(this.ivLength);
    const cipher = crypto.createCipheriv(this.algorithm, Buffer.from(this.secretKey), iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return `${iv.toString('hex')}:${encrypted}`;
  }

  decrypt(encryptedText: string): string {
    const [ivHex, encryptedData] = encryptedText.split(':');
    const iv = Buffer.from(ivHex, 'hex');
    const decipher = crypto.createDecipheriv(this.algorithm, Buffer.from(this.secretKey), iv);
    let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  }
}
