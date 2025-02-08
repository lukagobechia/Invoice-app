import { Transform } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class QueryParamsDto {
  @Transform(({ value }) => Number(value))
  @IsNumber()
  @IsOptional()
  page: number = 1;

  @Transform(({ value }) => Number(value))
  @IsNumber()
  @IsOptional()
  take: number = 10;

  @IsString()
  @IsOptional()
  status?: string;
}
