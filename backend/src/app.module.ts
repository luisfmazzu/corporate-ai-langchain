import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Document } from './entities/document.entity';
import { Chat } from './entities/chat.entity';
import { Message } from './entities/message.entity';

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
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
