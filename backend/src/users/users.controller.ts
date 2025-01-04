import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import mongoose from 'mongoose';
import { IsValidObjectIdPipe } from 'src/pipes/isValidObjectId.pipe';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  findAll(@Query() query) {
    return this.usersService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id', IsValidObjectIdPipe) id: mongoose.Schema.Types.ObjectId) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id',IsValidObjectIdPipe) id: mongoose.Schema.Types.ObjectId, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id',IsValidObjectIdPipe) id: mongoose.Schema.Types.ObjectId) {
    return this.usersService.remove(id);
  }
}
