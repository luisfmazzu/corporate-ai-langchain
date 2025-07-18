import { Test, TestingModule } from '@nestjs/testing';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { CreateChatDto } from './dto/create-chat.dto';
import { QueryDto } from './dto/query.dto';

describe('ChatController', () => {
  let controller: ChatController;
  let service: ChatService;

  const mockChatService = {
    createChat: jest.fn(),
    getChats: jest.fn(),
    getChat: jest.fn(),
    processQuery: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ChatController],
      providers: [
        {
          provide: ChatService,
          useValue: mockChatService,
        },
      ],
    }).compile();

    controller = module.get<ChatController>(ChatController);
    service = module.get<ChatService>(ChatService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createChat', () => {
    it('should create a new chat', async () => {
      const createChatDto: CreateChatDto = {
        title: 'Test Chat',
        documentId: 1,
        employeeId: 'emp123',
      };

      const expectedResult = { chatId: 1 };
      mockChatService.createChat.mockResolvedValue(expectedResult);

      const result = await controller.createChat(createChatDto);

      expect(result).toEqual(expectedResult);
      expect(service.createChat).toHaveBeenCalledWith(createChatDto);
    });
  });

  describe('getChats', () => {
    it('should return chats for employee', async () => {
      const employeeId = 'emp123';
      const expectedChats = [
        { id: 1, title: 'Chat 1', documentId: 1 },
        { id: 2, title: 'Chat 2', documentId: 1 },
      ];

      mockChatService.getChats.mockResolvedValue(expectedChats);

      const result = await controller.getChats(employeeId);

      expect(result).toEqual(expectedChats);
      expect(service.getChats).toHaveBeenCalledWith(employeeId);
    });
  });

  describe('getChat', () => {
    it('should return a specific chat', async () => {
      const chatId = '1';
      const expectedChat = { id: 1, title: 'Test Chat', messages: [] };

      mockChatService.getChat.mockResolvedValue(expectedChat);

      const result = await controller.getChat(chatId);

      expect(result).toEqual(expectedChat);
      expect(service.getChat).toHaveBeenCalledWith(1);
    });
  });

  describe('query', () => {
    it('should process a query', async () => {
      const queryDto: QueryDto = {
        documentId: 1,
        query: 'What is the main topic?',
        chatId: 1,
      };

      const expectedResult = {
        answer: 'The main topic is...',
        sources: [{ id: 1, content: 'source content' }],
      };

      mockChatService.processQuery.mockResolvedValue(expectedResult);

      const result = await controller.query(queryDto);

      expect(result).toEqual(expectedResult);
      expect(service.processQuery).toHaveBeenCalledWith(queryDto);
    });
  });
}); 