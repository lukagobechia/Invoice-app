import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { SignUpDto } from './dto/signUp.dto';
import { SignInDto } from './dto/signIn.dto';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import mongoose from 'mongoose';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async signUp(signUpDto: SignUpDto) {
    const existUser = await this.usersService.findOneByEmail(signUpDto.email);
    console.log(existUser);
    if (existUser)
      throw new BadRequestException('User with that emial already exists');

    const hashedPassword = await bcrypt.hash(signUpDto.password, 10);

    const newUser = await this.usersService.create({
      ...signUpDto,
      password: hashedPassword,
    });

    return newUser;
  }

  async signIn(signInDto: SignInDto) {
    const existUser = await this.usersService.findOneByEmail(signInDto.email);
    if (!existUser)
      throw new BadRequestException('Email or password is incorrect');

    const isPassEqual = await bcrypt.compare(
      signInDto.password,
      existUser.password,
    );

    if (!isPassEqual)
      throw new UnauthorizedException('Email or password is incorrect');
    const payload = {
      userId: existUser._id,
      role: existUser.role,
    };
    const accessToken = await this.jwtService.sign(payload, {
      expiresIn: '1h',
    });

    return { accessToken };
  }

  async getCurrentUser(userId: mongoose.Schema.Types.ObjectId) {
    const user = await this.usersService.findOne(userId);
    console.log(user);
    if (!user) throw new BadRequestException('User not found');

    return user;
  }
}
