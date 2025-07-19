import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Document } from '../../src/entities/document.entity';
import { Chat } from '../../src/entities/chat.entity';
import { Message } from '../../src/entities/message.entity';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        AppModule,
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          entities: [Document, Chat, Message],
          synchronize: true,
        }),
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  describe('Document Upload Flow', () => {
    it('should upload a document successfully', async () => {
      const testFile = Buffer.from('test document content');
      
      const response = await request(app.getHttpServer())
        .post('/upload')
        .attach('file', testFile, 'test.pdf')
        .expect(201);

      expect(response.body).toHaveProperty('documentId');
      expect(response.body).toHaveProperty('status', 'Processing');
    });

    it('should reject invalid file types', async () => {
      const testFile = Buffer.from('test content');
      
      await request(app.getHttpServer())
        .post('/upload')
        .attach('file', testFile, 'test.txt')
        .expect(400);
    });

    it('should reject files that are too large', async () => {
      const largeFile = Buffer.alloc(11 * 1024 * 1024); // 11MB
      
      await request(app.getHttpServer())
        .post('/upload')
        .attach('file', largeFile, 'large.pdf')
        .expect(400);
    });
  });

  describe('Chat Management Flow', () => {
    let documentId: number;

    beforeEach(async () => {
      // Create a test document first
      const testFile = Buffer.from('test document content');
      const uploadResponse = await request(app.getHttpServer())
        .post('/upload')
        .attach('file', testFile, 'test.pdf');
      
      documentId = uploadResponse.body.documentId;
    });

    it('should create a new chat', async () => {
      const chatData = {
        title: 'Test Chat',
        documentId: documentId,
        employeeId: 'emp123',
      };

      const response = await request(app.getHttpServer())
        .post('/chat')
        .send(chatData)
        .expect(201);

      expect(response.body).toHaveProperty('chatId');
      expect(typeof response.body.chatId).toBe('number');
    });

    it('should retrieve chats for a document', async () => {
      // Create a chat first
      const chatData = {
        title: 'Test Chat',
        documentId: documentId,
      };

      await request(app.getHttpServer())
        .post('/chat')
        .send(chatData);

      const response = await request(app.getHttpServer())
        .get(`/chat?documentId=${documentId}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
    });

    it('should retrieve a specific chat with messages', async () => {
      // Create a chat first
      const chatData = {
        title: 'Test Chat',
        documentId: documentId,
      };

      const createResponse = await request(app.getHttpServer())
        .post('/chat')
        .send(chatData);

      const chatId = createResponse.body.chatId;

      const response = await request(app.getHttpServer())
        .get(`/chat/${chatId}`)
        .expect(200);

      expect(response.body).toHaveProperty('id', chatId);
      expect(response.body).toHaveProperty('title', 'Test Chat');
      expect(response.body).toHaveProperty('messages');
    });
  });

  describe('Query Processing Flow', () => {
    let documentId: number;
    let chatId: number;

    beforeEach(async () => {
      // Create a test document and chat
      const testFile = Buffer.from('This is a test document about artificial intelligence and machine learning.');
      const uploadResponse = await request(app.getHttpServer())
        .post('/upload')
        .attach('file', testFile, 'test.pdf');
      
      documentId = uploadResponse.body.documentId;

      const chatData = {
        title: 'Test Chat',
        documentId: documentId,
      };

      const chatResponse = await request(app.getHttpServer())
        .post('/chat')
        .send(chatData);
      
      chatId = chatResponse.body.chatId;
    });

    it('should process a query and return an answer', async () => {
      const queryData = {
        documentId: documentId,
        query: 'What is this document about?',
        chatId: chatId,
      };

      const response = await request(app.getHttpServer())
        .post('/chat/query')
        .send(queryData)
        .expect(201);

      expect(response.body).toHaveProperty('answer');
      expect(response.body).toHaveProperty('sources');
      expect(typeof response.body.answer).toBe('string');
      expect(response.body.answer.length).toBeGreaterThan(0);
    });

    it('should handle queries without chat context', async () => {
      const queryData = {
        documentId: documentId,
        query: 'What is this document about?',
      };

      const response = await request(app.getHttpServer())
        .post('/chat/query')
        .send(queryData)
        .expect(201);

      expect(response.body).toHaveProperty('answer');
      expect(response.body).toHaveProperty('sources');
    });

    it('should reject queries for non-existent documents', async () => {
      const queryData = {
        documentId: 99999,
        query: 'What is this document about?',
      };

      await request(app.getHttpServer())
        .post('/chat/query')
        .send(queryData)
        .expect(500);
    });
  });

  describe('Document Management', () => {
    it('should retrieve all documents', async () => {
      // Create a test document first
      const testFile = Buffer.from('test document content');
      await request(app.getHttpServer())
        .post('/upload')
        .attach('file', testFile, 'test.pdf');

      const response = await request(app.getHttpServer())
        .get('/documents')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
    });

    it('should create test documents', async () => {
      const response = await request(app.getHttpServer())
        .post('/test-document')
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('fileName', 'test.pdf');
    });
  });

  describe('Error Handling', () => {
    it('should handle malformed JSON in requests', async () => {
      await request(app.getHttpServer())
        .post('/chat')
        .send('invalid json')
        .set('Content-Type', 'application/json')
        .expect(400);
    });

    it('should handle missing required fields', async () => {
      await request(app.getHttpServer())
        .post('/chat')
        .send({})
        .expect(400);
    });

    it('should handle invalid document IDs', async () => {
      await request(app.getHttpServer())
        .get('/chat?documentId=invalid')
        .expect(400);
    });
  });
}); 