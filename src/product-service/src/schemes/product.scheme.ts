import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema({ timestamps: true })
export class Product {
  @Prop({ type: String, unique: true, required: true })
  name: string;

  @Prop({ type: String, required: true })
  content: string;

  @Prop({ type: Buffer, required: false })
  imageBuffer: Buffer;

  @Prop({ type: Number, required: true })
  price: number;

  @Prop({ type: Types.ObjectId, ref: 'Type' })
  type: Types.ObjectId; // Ссылка на модель Type
}

export const ProductSchema = SchemaFactory.createForClass(Product);
