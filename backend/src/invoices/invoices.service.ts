import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Invoice } from './schema/invoice.schema';
import mongoose, { Model } from 'mongoose';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class InvoicesService {
  constructor(
    @InjectModel(Invoice.name) private readonly invoiceModel: Model<Invoice>,
    private readonly usersService: UsersService,
  ) {}

  async create(
    userId: mongoose.Schema.Types.ObjectId,
    createInvoiceDto: CreateInvoiceDto,
  ) {
    const user = await this.usersService.findOne(userId);

    if (!user) throw new BadRequestException('User not found');

    const invoice = await this.invoiceModel.create({
      ...createInvoiceDto,
      user: userId,
      senderAddress: user.address,
    });

    await this.usersService.addInvoice(userId, invoice._id);

    return invoice;
  }

  async findAll(userId: mongoose.Schema.Types.ObjectId) {
    return this.invoiceModel
      .find({ user: userId })
      .populate({
        path: 'user',
        select:
          '-password -createdAt -updatedAt -dob -phoneNumber -company -__v',
      })
      .select('-__v -updatedAt');
  }

  findOne(id: number) {
    return `This action returns a ${id} invoice`;
  }

  update(id: number, updateInvoiceDto: UpdateInvoiceDto) {
    return `This action updates a #${id} invoice`;
  }

  remove(id: number) {
    return `This action removes a #${id} invoice`;
  }
}
