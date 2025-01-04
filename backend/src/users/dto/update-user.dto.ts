import {
    IsString,
    IsEmail,
    IsOptional,
    IsDateString,
    IsEnum,
    ValidateNested,
    IsPhoneNumber,
    Matches
  } from 'class-validator';
  import { Type } from 'class-transformer';
  import mongoose from 'mongoose';
  
  export class UpdateAddressDto {
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
  
  export class UpdateUserDto {
    @IsOptional()
    @IsString()
    firstName: string;
  
    @IsOptional()
    @IsString()
    lastName: string;
  
    @IsOptional()
    @IsEmail()
    email: string;
  
    @IsOptional()
    @IsString()
    @Matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/,
      {
        message:
          'Password must be 8-20 characters long, include at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&).',
      },
    )
    password: string;
  
    @IsOptional()
    @IsDateString()
    dob: string;
  
    @IsOptional()
    @IsEnum(['admin', 'user'])
    role: 'admin' | 'user' = 'user';
  
    @IsOptional()
    @IsPhoneNumber('GE')
    @Matches(/^\+?[1-9]\d{1,14}$/, {
      message:
        'Phone number must be a valid international number starting with + followed by 1-14 digits.',
    })
    phoneNumber: number;
  
    @IsOptional()
    @ValidateNested()
    @Type(() => UpdateAddressDto)
    address: UpdateAddressDto;
  
    @IsOptional()
    @IsString()
    company?: string;
  
    @IsOptional()
    invoices?: mongoose.Schema.Types.ObjectId[];
  }