import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Document } from './entities/document.entity';
import { Chat } from './entities/chat.entity';
import { Message } from './entities/message.entity';
import { UploadController } from './upload/upload.controller';
import { UploadService } from './upload/upload.service';
import { DocumentProcessorService } from './document-processor/document-processor.service';
import { ChatController } from './chat/chat.controller';
import { ChatService } from './chat/chat.service';
import { LangChainService } from './langchain/langchain.service';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'database.sqlite',
      entities: [Document, Chat, Message],
      synchronize: true, // Auto-create tables (for development)
    }),
    TypeOrmModule.forFeature([Document, Chat, Message]),
  ],
  controllers: [AppController, UploadController, ChatController],
  providers: [AppService, UploadService, DocumentProcessorService, ChatService, LangChainService],
})
export class AppModule {}
