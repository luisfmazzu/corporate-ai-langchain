import { Controller, Post, Get, Body, Param, Query } from '@nestjs/common';
import { ChatService } from './chat.service';
import { QueryDto } from './dto/query.dto';
import { CreateChatDto } from './dto/create-chat.dto';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post()
  async createChat(@Body() createChatDto: CreateChatDto) {
    return this.chatService.createChat(createChatDto);
  }

  @Get()
  async getChats(@Query('employeeId') employeeId?: string) {
    return this.chatService.getChats(employeeId);
  }

  @Get(':id')
  async getChat(@Param('id') id: string) {
    return this.chatService.getChat(parseInt(id));
  }

  @Post('query')
  async query(@Body() queryDto: QueryDto) {
    return this.chatService.processQuery(queryDto);
  }
} 