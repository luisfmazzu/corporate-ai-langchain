import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Chat } from '../entities/chat.entity';
import { Message, MessageType } from '../entities/message.entity';
import { Document } from '../entities/document.entity';
import { CreateChatDto } from './dto/create-chat.dto';
import { QueryDto } from './dto/query.dto';
import { LangChainService } from '../langchain/langchain.service';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Chat)
    private chatRepository: Repository<Chat>,
    @InjectRepository(Message)
    private messageRepository: Repository<Message>,
    @InjectRepository(Document)
    private documentRepository: Repository<Document>,
    private langChainService: LangChainService,
  ) {}

  async createChat(createChatDto: CreateChatDto): Promise<{ chatId: number }> {
    const chat = this.chatRepository.create({
      title: createChatDto.title,
      documentId: createChatDto.documentId,
      employeeId: createChatDto.employeeId,
    });

    const savedChat = await this.chatRepository.save(chat);
    return { chatId: savedChat.id };
  }

  async getChats(employeeId?: string): Promise<Chat[]> {
    const where = employeeId ? { employeeId } : {};
    return this.chatRepository.find({
      where,
      relations: ['document'],
      order: { updatedAt: 'DESC' },
    });
  }

  async getChat(id: number): Promise<Chat | null> {
    return this.chatRepository.findOne({
      where: { id },
      relations: ['messages', 'document'],
      order: { messages: { timestamp: 'ASC' } },
    });
  }

  async processQuery(queryDto: QueryDto): Promise<{ answer: string; sources: any[] }> {
    const document = await this.documentRepository.findOne({
      where: { id: queryDto.documentId },
    });

    if (!document || !document.isProcessed) {
      throw new Error('Document not found or not processed');
    }

    // Save user message
    if (queryDto.chatId) {
      await this.messageRepository.save({
        content: queryDto.query,
        type: MessageType.USER,
        chatId: queryDto.chatId,
      });
    }

    // Process with LangChain
    const result = await this.langChainService.processQuery(
      queryDto.query,
      document.extractedText,
      queryDto.chatId,
    );

    // Save AI response
    if (queryDto.chatId) {
      await this.messageRepository.save({
        content: result.answer,
        type: MessageType.AI,
        metadata: { sources: result.sources },
        chatId: queryDto.chatId,
      });
    }

    return result;
  }
} 