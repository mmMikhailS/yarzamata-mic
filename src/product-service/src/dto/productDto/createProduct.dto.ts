import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class createProductDto {
  @ApiProperty({ description: " it's name" })
  @IsString({ message: 'name is not a  string' })
  name: string;

  @ApiProperty({ description: " it's content" })
  @IsString({ message: 'content is not a  string' })
  content: string;

  @ApiProperty({ description: " it's typeName" })
  @IsString({ message: 'type name is not a string ' })
  typeName: string;

  @ApiProperty({ description: " it's price" })
  @IsString({ message: 'price name is not a string ' })
  price: string;
}
