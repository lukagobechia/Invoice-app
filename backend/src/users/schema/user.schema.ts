import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
@Schema()
class Address {
  @Prop({ type: String})
  street: string;

  @Prop({ type: String})
  city: string;

  @Prop({ type: String })
  state?: string;

  @Prop({ type: String})
  postalCode: string;

  @Prop({ type: String})
  country: string;
}
const AddressSchema = SchemaFactory.createForClass(Address);

@Schema({ timestamps: true })
export class User {
  @Prop({ type: String, required: true })
  firstName: string;

  @Prop({ type: String, required: true })
  lastName: string;

  @Prop({ type: String, required: true, unique: true, index: true })
  email: string;

  @Prop({
    type: String,
    required: true,
    match:
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/,
  })
  password: string;

  @Prop({ type: Date, required: true })
  dob: Date;

  @Prop({ enum: ['admin', 'user'], default: 'user', index: true })
  role: 'admin' | 'user';

  @Prop({ type: Number, required: true, match: /^\+?[1-9]\d{1,14}$/ })
  phoneNumber: number;

  @Prop({ type: AddressSchema, required: true })
  address: Address;

  @Prop({ type: String })
  company: string;

  @Prop({ type: [mongoose.Schema.Types.ObjectId], ref: 'Invoice', default: [] })
  invoices: mongoose.Schema.Types.ObjectId[];
}

export const UserSchema = SchemaFactory.createForClass(User);
