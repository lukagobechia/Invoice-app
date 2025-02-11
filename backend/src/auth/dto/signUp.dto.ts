import {
  IsNotEmpty,
  IsString,
  IsEmail,
  IsOptional,
  IsDateString,
  IsEnum,
  ValidateNested,
  IsPhoneNumber,
  Matches,
} from 'class-validator';
import { Type } from 'class-transformer';
import mongoose from 'mongoose';

export class Address {
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

export class SignUpDto {
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @IsNotEmpty()
  @IsString()
  lastName: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/,
    {
      message:
        'Password must be 8-20 characters long, include at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&).',
    },
  )
  password: string;

  @IsNotEmpty()
  @IsDateString()
  dob: string;

  @IsOptional()
  @IsEnum(['admin', 'user'])
  role: 'admin' | 'user' = 'user';

  @Matches(/[1-9]\d{1,14}$/, {
    message:
      'Phone number must be a valid international number with 1-14 digits.',
  })
  phoneNumber: string;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => Address)
  address: Address;

  @IsOptional()
  @IsString()
  company?: string;

  @IsOptional()
  invoices?: mongoose.Schema.Types.ObjectId[];
}
