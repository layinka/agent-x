import { IsString, IsNotEmpty, MinLength, MaxLength } from "class-validator";

export class LoginWithGoogleDto {
    @IsString()
  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(64)
  public token: string;

}