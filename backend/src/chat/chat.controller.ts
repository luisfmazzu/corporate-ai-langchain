import { Controller, Post, Get, Body, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiBody } from '@nestjs/swagger';
import { ChatService } from './chat.service';
import { QueryDto } from './dto/query.dto';
import { CreateChatDto } from './dto/create-chat.dto';

@ApiTags('chat')
@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new chat' })
  @ApiBody({ type: CreateChatDto })
  @ApiResponse({ status: 201, description: 'Chat created successfully' })
  async createChat(@Body() createChatDto: CreateChatDto) {
    return this.chatService.createChat(createChatDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get chat history' })
  @ApiQuery({ name: 'employeeId', required: false, description: 'Filter by employee ID' })
  @ApiQuery({ name: 'documentId', required: false, description: 'Filter by document ID' })
  @ApiResponse({ status: 200, description: 'Chat history retrieved successfully' })
  async getChats(@Query('employeeId') employeeId?: string, @Query('documentId') documentId?: string) {
    return this.chatService.getChats(employeeId, documentId ? parseInt(documentId) : undefined);
  }

  @Get(':id')
  async getChat(@Param('id') id: string) {
    return this.chatService.getChat(parseInt(id));
  }

  @Post('query')
  @ApiOperation({ summary: 'Send a query to the AI' })
  @ApiBody({ type: QueryDto })
  @ApiResponse({ status: 200, description: 'Query processed successfully' })
  async query(@Body() queryDto: QueryDto) {
    return this.chatService.processQuery(queryDto);
  }
} 