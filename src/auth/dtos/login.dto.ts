import { IsString, MaxLength, MinLength } from 'class-validator';

export class LoginDto {
  @IsString()
  login: string;

  @IsString()
  @MinLength(6, {
    message: 'Your password is too short, use 6 characters or more !',
  })
  @MaxLength(20, { message: 'Your password is too long !' })
  password: string;
}
