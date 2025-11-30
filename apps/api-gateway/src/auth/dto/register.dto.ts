import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayNotEmpty,
  ArrayUnique,
  IsArray,
  IsEmail,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class RegisterDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'strongPassword123' })
  @IsString()
  @MinLength(8)
  password: string;

  @ApiProperty({ example: ['user'], required: false, isArray: true })
  @IsArray()
  @IsString({ each: true })
  @ArrayNotEmpty()
  @ArrayUnique()
  @IsOptional()
  roles?: string[];
}
