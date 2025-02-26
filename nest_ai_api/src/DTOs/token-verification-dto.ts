import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';
import { Exclude, Expose } from 'class-transformer';
 
export class TokenVerificationDto {
  @ApiProperty()
  @Expose()
  @IsString()
  @IsNotEmpty()
  token: string;
}
 
export default TokenVerificationDto;