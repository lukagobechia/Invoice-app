import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import mongoose from 'mongoose';
import { IsValidObjectIdPipe } from 'src/pipes/isValidObjectId.pipe';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { IsAdmin } from 'src/auth/guards/role.guard';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(AuthGuard, IsAdmin)
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @UseGuards(AuthGuard, IsAdmin)
  @Get()
  findAll(@Query() query) {
    return this.usersService.findAll(query);
  }

  @UseGuards(AuthGuard, IsAdmin)
  @Get(':id')
  findOne(
    @Param('id', IsValidObjectIdPipe) id: mongoose.Schema.Types.ObjectId,
  ) {
    return this.usersService.findOne(id);
  }

  @UseGuards(AuthGuard, IsAdmin)
  @Patch(':id')
  update(
    @Param('id', IsValidObjectIdPipe) id: mongoose.Schema.Types.ObjectId,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.update(id, updateUserDto);
  }

  @UseGuards(AuthGuard, IsAdmin)
  @Delete(':id')
  remove(@Param('id', IsValidObjectIdPipe) id: mongoose.Schema.Types.ObjectId) {
    return this.usersService.remove(id);
  }
}
