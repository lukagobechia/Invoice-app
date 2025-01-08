import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { User } from 'src/users/schema/user.schema';

@Schema({ timestamps: false })
class Address {
  @Prop({ type: String, required: true })
  street: string;

  @Prop({ type: String, required: true })
  city: string;

  @Prop({ type: String })
  state: string;

  @Prop({ type: String, required: true })
  postalCode: string;

  @Prop({ type: String, required: true })
  country: string;
}

const AddressSchema = SchemaFactory.createForClass(Address);

@Schema({ timestamps: false })
class Item {
  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: Number, required: true })
  quantity: number;

  @Prop({ type: Number, required: true })
  price: number;

  @Prop({ type: Number, required: true })
  total: number;
}

const ItemSchema = SchemaFactory.createForClass(Item);

@Schema({ timestamps: true })
export class Invoice {
  @Prop({ type: String })
  description: string;

  @Prop({ type: Number, required: true })
  paymentTerms: number;

  @Prop({ type: Date, required: true })
  createdAt: Date;

  @Prop({ type: Date, required: true })
  paymentDue: Date;

  @Prop({ type: String })
  clientName: string;

  @Prop({ type: String })
  clientEmail: string;

  @Prop({ type: AddressSchema, required: true })
  clientAddress: Address;

  @Prop({ type: AddressSchema, required: true })
  senderAddress: Address;

  @Prop({ type: [ItemSchema], default: [] })
  items: Item[];

  @Prop({ type: Number, required: true })
  total: number;

  @Prop({ enum: ['draft', 'pending', 'paid'], default: 'draft' })
  status: 'draft' | 'pending' | 'paid';

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name })
  user: mongoose.Schema.Types.ObjectId;
}

export const InvoiceSchema = SchemaFactory.createForClass(Invoice);
