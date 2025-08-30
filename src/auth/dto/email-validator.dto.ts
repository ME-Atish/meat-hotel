import { IsEmail, IsNotEmpty } from 'class-validator';

export class EmailValidatorDto {
  @IsNotEmpty()
  @IsEmail()
  to: string;
}
