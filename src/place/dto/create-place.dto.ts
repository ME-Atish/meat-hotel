import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreatePlaceDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  name: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @MaxLength(100)
  address: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @MaxLength(100)
  description: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  facilities: string;

  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  price: number;

  @IsNotEmpty()
  @IsString()
  @MinLength(2)
  @MaxLength(25)
  province: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(2)
  @MaxLength(25)
  city: string;
}
