import { BadRequestException, Injectable } from '@nestjs/common';
import { RegisterDto } from './dtos/register.dto';
import { LoginDto } from './dtos/login.dto';
import { User } from '../user/entity/user.entity';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './jwt-payload.interface';
import { UserService } from '../user/user.service';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AuthHistory } from './entity/auth-history.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(AuthHistory.name)
    private readonly authHistoryModel: Model<AuthHistory>,
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  register(dto: RegisterDto): Promise<User | BadRequestException> {
    if (dto.password !== dto.passwordConfirm) {
      throw new BadRequestException('Passwords do not match');
    }
    return this.userService.create(dto);
  }

  async login(loginCredentials: LoginDto): Promise<{ access_token: string }> {
    const { password } = loginCredentials;
    const user = await this.userService.findOne(loginCredentials.loginEmail);

    if (user && (await bcrypt.compare(password, user.password))) {
      const payload: JwtPayload = { login: user.login, id: `${user._id}` };
      const access_token: string = this.jwtService.sign(payload, {
        expiresIn: 3600 * 24 * 30 * 365,
      });

      await this.authHistoryModel.create({ login: user.login });

      return { access_token };
    } else {
      throw new BadRequestException(
        'Something is wrong with your logging credentials...',
      );
    }
  }
}
