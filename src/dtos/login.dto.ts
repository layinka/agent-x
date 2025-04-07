import { IsString, IsNotEmpty, MinLength, MaxLength } from "class-validator";

export class LoginWithGoogleDto {
    @IsString()
  @IsNotEmpty()
  @MinLength(640)
  public token: string;

}