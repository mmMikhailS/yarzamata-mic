import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema({ timestamps: true })
export class Order {
  @Prop({
    type: String,
    enum: ['PENDING', 'PAYED', 'SHIPPED', 'DELIVERED'],
    default: 'PENDING',
  })
  status: 'PENDING' | 'PAYED' | 'SHIPPED' | 'DELIVERED';

  @Prop({ type: [{ type: Types.ObjectId, ref: 'OrderItem' }] })
  items: Types.ObjectId[]; // Ссылки на модель OrderItem

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user: Types.ObjectId; // Ссылка на модель User
}

export const OrderSchema = SchemaFactory.createForClass(Order);
