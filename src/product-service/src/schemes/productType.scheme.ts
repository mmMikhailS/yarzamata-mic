import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class Type {
  @Prop({ type: String, unique: true, required: true })
  name: string;
}

export const TypeSchema = SchemaFactory.createForClass(Type);
