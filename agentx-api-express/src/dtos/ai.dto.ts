import { IsString, IsNotEmpty, MinLength, MaxLength } from "class-validator";

export class UserPromptDTO{
    @IsString()
  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(640)
    prompt: string;
}


export class UserMessagePromptDTO{
  
  messages: {
    id: string,
    role: 'system' | 'user' | 'assistant' | 'data';
    content: string,
    createdAt?: Date
  }[];
}