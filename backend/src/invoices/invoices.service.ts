import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Invoice } from './schema/invoice.schema';
import mongoose, { Model } from 'mongoose';
import { UsersService } from 'src/users/users.service';
import { QueryParamsDto } from './dto/query-Params.dto';

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

  async findAll(queryParams: QueryParamsDto) {
    const { page = 1, take = 50 } = queryParams;
    const limit = Math.min(take, 50);
    const skip = (page - 1) * limit;

    return this.invoiceModel
      .find()
      .skip(skip)
      .limit(limit)
      .populate({
        path: 'user',
        select:
          '-password -createdAt -updatedAt -dob -phoneNumber -address -company -invoices -__v',
      })
      .select('-__v -updatedAt');
  }

  async findAllByUser(
    userId: mongoose.Schema.Types.ObjectId,
    queryParams: QueryParamsDto,
  ) {
    const { page = 1, take = 50 } = queryParams;
    const limit = Math.min(take, 50);
    const skip = (page - 1) * limit;
    return this.invoiceModel
      .find({ user: userId })
      .skip(skip)
      .limit(limit)
      .populate({
        path: 'user',
        select:
          '-password -createdAt -updatedAt -dob -phoneNumber -address -company -invoices -__v',
      })
      .select('-__v -updatedAt');
  }

  async findOne(id: mongoose.Schema.Types.ObjectId) {
    const invoice = await this.invoiceModel.findById(id).populate({
      path: 'user',
      select:
        '-password -createdAt -updatedAt -dob -phoneNumber -address -company -invoices -__v',
    });

    if (!invoice) throw new BadRequestException('Invoice not found');
    return invoice;
  }

  async update(
    id: mongoose.Schema.Types.ObjectId,
    updateInvoiceDto: UpdateInvoiceDto,
  ) {
    const updateFields = {};

    for (const [key, value] of Object.entries(updateInvoiceDto)) {
      if (
        typeof value === 'object' &&
        value !== null &&
        !Array.isArray(value)
      ) {
        for (const [nestedKey, nestedValue] of Object.entries(value)) {
          updateFields[`${key}.${nestedKey}`] = nestedValue;
        }
      } else {
        updateFields[key] = value;
      }
    }

    const updatedInvoice = await this.invoiceModel.findByIdAndUpdate(
      id,
      { $set: updateFields },
      { new: true, runValidators: true },
    );

    if (!updatedInvoice) throw new BadRequestException('Invoice not found');
    return updatedInvoice;
  }

  async remove(id: mongoose.Schema.Types.ObjectId) {
    const deletedInvoice = await this.invoiceModel.findByIdAndDelete(id);
    if (!deletedInvoice) throw new BadRequestException('Invoice not found');
    return deletedInvoice;
  }
}
