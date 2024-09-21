import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type OrderItemDocument = OrderItem & Document;

@Schema({ timestamps: true })
export class OrderItem extends Document {
  @Prop({ type: Number, required: true })
  quantity: number;

  @Prop({ type: Number, required: true })
  price: number;

  @Prop({ type: Types.ObjectId, ref: 'Order' })
  order?: Types.ObjectId; // Ссылка на модель Order

  @Prop({ type: Types.ObjectId, ref: 'Product', required: true })
  product: Types.ObjectId; // Ссылка на модель Product
}

export const OrderItemSchema = SchemaFactory.createForClass(OrderItem);
