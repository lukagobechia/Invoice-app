import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  Query,
} from '@nestjs/common';
import mongoose from 'mongoose';
import { InvoicesService } from './invoices.service';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { IsValidObjectIdPipe } from 'src/pipes/isValidObjectId.pipe';
import { QueryParamsDto } from './dto/query-Params.dto';

@UseGuards(AuthGuard)
@Controller('invoices')
export class InvoicesController {
  constructor(private readonly invoicesService: InvoicesService) {}

  @Post()
  create(@Req() request, @Body() createInvoiceDto: CreateInvoiceDto) {
    const userId = request.userId;
    return this.invoicesService.create(userId, createInvoiceDto);
  }

  @Get()
  findAll(@Req() request, @Query() queryParams: QueryParamsDto) {
    const userId = request.userId;
    return this.invoicesService.findAll(userId, queryParams);
  }

  @Get(':id')
  findOne(
    @Param('id', IsValidObjectIdPipe) id: mongoose.Schema.Types.ObjectId,
  ) {
    return this.invoicesService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', IsValidObjectIdPipe) id: mongoose.Schema.Types.ObjectId,
    @Body() updateInvoiceDto: UpdateInvoiceDto,
  ) {
    return this.invoicesService.update(id, updateInvoiceDto);
  }

  @Delete(':id')
  remove(@Param('id', IsValidObjectIdPipe) id: mongoose.Schema.Types.ObjectId) {
    return this.invoicesService.remove(id);
  }
}
