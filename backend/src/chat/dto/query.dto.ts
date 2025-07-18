import { IsString, IsNumber, IsOptional } from 'class-validator';

export class QueryDto {
  @IsNumber()
  documentId: number;

  @IsString()
  query: string;

  @IsOptional()
  @IsNumber()
  chatId?: number;
} 