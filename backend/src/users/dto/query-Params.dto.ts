import { Transform } from 'class-transformer';
import { IsOptional } from 'class-validator';

export class QueryParamsDto {
  @Transform(({ value }) => Number(value))
  @IsOptional()
  page: number;
  
  @Transform(({ value }) => Number(value))
  @IsOptional()
  take: number;
}
