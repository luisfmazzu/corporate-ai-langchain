import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Document } from './entities/document.entity';
import { Chat } from './entities/chat.entity';
import { Message } from './entities/message.entity';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(Document)
    private documentRepository: Repository<Document>,
    @InjectRepository(Chat)
    private chatRepository: Repository<Chat>,
    @InjectRepository(Message)
    private messageRepository: Repository<Message>,
  ) {}

  getHello(): string {
    return 'Hello World!';
  }

  // Test CRUD operations
  async createTestDocument(): Promise<Document> {
    const document = this.documentRepository.create({
      fileName: 'test.pdf',
      fileType: 'pdf',
      fileSize: 1024,
      extractedText: 'Test document content',
      isProcessed: true,
    });
    return this.documentRepository.save(document);
  }

  async getAllDocuments(): Promise<Document[]> {
    return this.documentRepository.find();
  }
}
