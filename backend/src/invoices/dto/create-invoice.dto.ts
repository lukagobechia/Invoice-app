import { Type } from 'class-transformer';
import {
  IsArray,
  IsDateString,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

class AddressDto {
  @IsNotEmpty()
  @IsString()
  street: string;

  @IsNotEmpty()
  @IsString()
  city: string;

  @IsOptional()
  @IsString()
  state?: string | null;

  @IsNotEmpty()
  @IsString()
  postalCode: string;

  @IsNotEmpty()
  @IsString()
  country: string;
}

class ItemDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsNumber()
  quantity: number;

  @IsNotEmpty()
  @IsNumber()
  price: number;

  @IsNumber()
  total: number;
}

export class CreateInvoiceDto {
  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsNumber()
  paymentTerms: number;

  @IsNotEmpty()
  @IsDateString()
  createdAt: Date;

  @IsNotEmpty()
  @IsDateString()
  paymentDue: Date;

  @IsNotEmpty()
  @IsString()
  clientName: string;

  @IsNotEmpty()
  @IsEmail()
  clientEmail: string;

  @ValidateNested()
  @Type(() => AddressDto)
  clientAddress: AddressDto;

  @ValidateNested()
  @Type(() => AddressDto)
  senderAddress: AddressDto;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ItemDto)
  items: ItemDto[];

  @IsNotEmpty()
  @IsNumber()
  total: number;

  @IsEnum(['draft', 'pending', 'paid'])
  status: 'draft' | 'pending' | 'paid';
}
