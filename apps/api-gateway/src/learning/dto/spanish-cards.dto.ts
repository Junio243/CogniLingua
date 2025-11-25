import { IsInt, IsOptional, IsString, Min } from 'class-validator';

export class SpanishCardsDto {
  @IsString()
  studentId: string;

  @IsString()
  conceptId: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  limit?: number = 10;
}
