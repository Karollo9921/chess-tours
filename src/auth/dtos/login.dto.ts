import { IsString, MaxLength, MinLength } from 'class-validator';

export class LoginDto {
  @IsString()
  @MinLength(6, { message: 'Your password is too short !' })
  @MaxLength(20, { message: 'Your password is too long !' })
  loginEmail: string;

  @IsString()
  @MinLength(6, { message: 'Your password is too short !' })
  @MaxLength(20, { message: 'Your password is too long !' })
  password: string;
}
