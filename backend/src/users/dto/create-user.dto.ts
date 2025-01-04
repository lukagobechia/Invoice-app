import {
  IsNotEmpty,
  IsString,
  IsEmail,
  IsOptional,
  IsDateString,
  IsEnum,
  ValidateNested,
  IsPhoneNumber,
  Length,
  Matches,
} from 'class-validator';
import { Type } from 'class-transformer';
import mongoose from 'mongoose';

export class Address {
  @IsOptional()
  @IsString()
  street: string;

  @IsOptional()
  @IsString()
  city: string;

  @IsOptional()
  @IsString()
  state?: string;

  @IsOptional()
  @IsString()
  postalCode: string;
  
  @IsOptional()
  @IsString()
  country: string;
}

export class CreateUserDto {
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
  @Length(8, 20)
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

  @IsPhoneNumber('GE')
  @Matches(/^\+?[1-9]\d{1,14}$/, {
    message:
      'Phone number must be a valid international number starting with + followed by 1-14 digits.',
  })
  phoneNumber: number;

  @ValidateNested()
  @Type(() => Address)
  address: Address;

  @IsOptional()
  @IsString()
  company?: string;

  @IsOptional()
  invoices?: mongoose.Schema.Types.ObjectId[];
}
