import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UploadService } from './upload.service';
import { DocumentProcessorService } from '../document-processor/document-processor.service';
import { Document } from '../entities/document.entity';

describe('UploadService', () => {
  let service: UploadService;
  let documentRepository: Repository<Document>;
  let documentProcessorService: DocumentProcessorService;

  const mockDocumentRepository = {
    create: jest.fn(),
    save: jest.fn(),
  };

  const mockDocumentProcessorService = {
    processDocument: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UploadService,
        {
          provide: getRepositoryToken(Document),
          useValue: mockDocumentRepository,
        },
        {
          provide: DocumentProcessorService,
          useValue: mockDocumentProcessorService,
        },
      ],
    }).compile();

    service = module.get<UploadService>(UploadService);
    documentRepository = module.get<Repository<Document>>(getRepositoryToken(Document));
    documentProcessorService = module.get<DocumentProcessorService>(DocumentProcessorService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('processDocument', () => {
    it('should process a document successfully', async () => {
      const mockFile = {
        originalname: 'test.pdf',
        mimetype: 'application/pdf',
        size: 1024,
        buffer: Buffer.from('test content'),
      } as Express.Multer.File;

      const mockDocument = {
        id: 1,
        fileName: 'test.pdf',
        fileType: 'application/pdf',
        fileSize: 1024,
        isProcessed: false,
      };

      const expectedResult = { documentId: 1, status: 'Processing' };

      mockDocumentRepository.create.mockReturnValue(mockDocument);
      mockDocumentRepository.save.mockResolvedValue(mockDocument);
      mockDocumentProcessorService.processDocument.mockResolvedValue(undefined);

      const result = await service.processDocument(mockFile);

      expect(result).toEqual(expectedResult);
      expect(mockDocumentRepository.create).toHaveBeenCalledWith({
        fileName: 'test.pdf',
        fileType: 'application/pdf',
        fileSize: 1024,
        isProcessed: false,
      });
      expect(mockDocumentRepository.save).toHaveBeenCalledWith(mockDocument);
      expect(mockDocumentProcessorService.processDocument).toHaveBeenCalledWith(1, mockFile.buffer);
    });
  });
}); 