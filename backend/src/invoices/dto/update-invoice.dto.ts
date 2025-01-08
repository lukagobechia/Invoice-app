import { Type } from 'class-transformer';
import {
  IsArray,
  IsDateString,
  IsEmail,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

class UpdateAddressDto {
  @IsOptional()
  @IsString()
  street: string;

  @IsOptional()
  @IsString()
  city: string;

  @IsOptional()
  @IsString()
  state?: string | null;

  @IsOptional()
  @IsString()
  postalCode: string;

  @IsOptional()
  @IsString()
  country: string;
}

class UpdateItemDto {
  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsNumber()
  quantity: number;

  @IsOptional()
  @IsNumber()
  price: number;

  @IsOptional()
  @IsNumber()
  total: number;
}

export class UpdateInvoiceDto {
  @IsOptional()
  @IsString()
  description: string;

  @IsOptional()
  @IsNumber()
  paymentTerms: number;

  @IsOptional()
  @IsDateString()
  createdAt: Date;

  @IsOptional()
  @IsDateString()
  paymentDue: Date;

  @IsOptional()
  @IsString()
  clientName: string;

  @IsOptional()
  @IsEmail()
  clientEmail: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => UpdateAddressDto)
  clientAddress: UpdateAddressDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => UpdateAddressDto)
  senderAddress: UpdateAddressDto;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateItemDto)
  items: UpdateItemDto[];

  @IsOptional()
  @IsNumber()
  total: number;

  @IsOptional()
  @IsEnum(['draft', 'pending', 'paid'])
  status: 'draft' | 'pending' | 'paid';
}
