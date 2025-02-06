import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schema/user.schema';
import mongoose, { Model } from 'mongoose';
import { QueryParamsDto } from './dto/query-Params.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}
  
  async create(createUserDto: CreateUserDto) {
    const newuser = await this.userModel.create(createUserDto);
    if (!newuser) throw new BadRequestException('User could not be created');
    return newuser;
  }

  async findAll(query: QueryParamsDto) {
    const { page = 1, take = 30 } = query;
    const limit = Math.min(take, 30);
    const users = await this.userModel
      .find()
      .skip((page - 1) * limit)
      .limit(page * limit);
    return users;
  }

  async findOne(id: mongoose.Schema.Types.ObjectId) {
    const user = await this.userModel.findById(id);
    if (!user) throw new BadRequestException('User Not Found');
    return user;
  }

  async findOneByEmail(email: string) {
    const user = await this.userModel
      .findOne({ email: email })
      .select('+password');
    return user;
  }

  async update(
    id: mongoose.Schema.Types.ObjectId,
    updateUserDto: UpdateUserDto,
  ) {
    const updateFileds = {};

    for (const [key, value] of Object.entries(updateUserDto)) {
      if (
        typeof value === 'object' &&
        value !== null &&
        !Array.isArray(value)
      ) {
        for (const [nestedKey, nestedValue] of Object.entries(value)) {
          updateFileds[`${key}.${nestedKey}`] = nestedValue;
        }
      } else {
        updateFileds[key] = value;
      }
    }

    const updatedUser = await this.userModel.findByIdAndUpdate(
      id,
      { $set: updateFileds },
      { new: true },
    );
    if (!updatedUser) throw new BadRequestException('User Not Found');
    return updatedUser;
  }

  async remove(id: mongoose.Schema.Types.ObjectId) {
    const deletedUser = await this.userModel.findByIdAndDelete(id);
    if (!deletedUser) throw new BadRequestException('User Not Found');
    return deletedUser;
  }

  async addInvoice(userId, invoiceId) {
    const user = await this.userModel.findById(userId);
    if (!user) throw new BadRequestException('User Not Found');
    const invoices = user.invoices;
    invoices.push(invoiceId);
    const updatedUser = await this.userModel.findByIdAndUpdate(
      user._id,
      { ...user, invoices },
      { new: true },
    );

    return updatedUser;
  }
  
  async removeInvoice(userId, invoiceId) {
    const user = await this.userModel.findById(userId);
    if (!user) throw new BadRequestException('User Not Found');

    const invoices = user.invoices.filter((id) => id !== invoiceId);
    const updatedUser = await this.userModel.findByIdAndUpdate(
      user._id,
      { ...user, invoices },
      { new: true },
    );

    return updatedUser;
  }
}
