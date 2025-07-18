import { IsString, IsNumber, IsOptional } from 'class-validator';

export class CreateChatDto {
  @IsString()
  title: string;

  @IsNumber()
  documentId: number;

  @IsOptional()
  @IsString()
  employeeId?: string;
} 