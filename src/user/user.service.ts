import { Model } from 'mongoose';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './entity/user.entity';
import { RegisterDto } from '../auth/dtos/register.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async create(dto: RegisterDto): Promise<User> {
    const { login, email, password } = dto;
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.userModel.findOne({
      $or: [{ login: login.toLowerCase() }, { email: email.toLowerCase() }],
    });

    if (user) {
      throw new BadRequestException('Provided Login or Email already exists');
    }

    return this.userModel.create({
      login: login.toLowerCase(),
      email: email.toLowerCase(),
      password: hashedPassword,
    });
  }

  findOne(loginEmail: string): Promise<UserDocument> {
    console.log(loginEmail);
    return this.userModel.findOne({ login: loginEmail.toLowerCase() });
  }
}
