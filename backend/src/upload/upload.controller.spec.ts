import { Test, TestingModule } from '@nestjs/testing';
import { UploadController } from './upload.controller';
import { UploadService } from './upload.service';
import { BadRequestException } from '@nestjs/common';

describe('UploadController', () => {
  let controller: UploadController;
  let service: UploadService;

  const mockUploadService = {
    processDocument: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UploadController],
      providers: [
        {
          provide: UploadService,
          useValue: mockUploadService,
        },
      ],
    }).compile();

    controller = module.get<UploadController>(UploadController);
    service = module.get<UploadService>(UploadService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('uploadDocument', () => {
    it('should process valid PDF file', async () => {
      const mockFile = {
        originalname: 'test.pdf',
        mimetype: 'application/pdf',
        size: 1024,
        buffer: Buffer.from('test content'),
      } as Express.Multer.File;

      const expectedResult = { documentId: 1, status: 'Processing' };
      mockUploadService.processDocument.mockResolvedValue(expectedResult);

      const result = await controller.uploadDocument(mockFile);

      expect(result).toEqual(expectedResult);
      expect(service.processDocument).toHaveBeenCalledWith(mockFile);
    });

    it('should throw BadRequestException when no file is uploaded', async () => {
      await expect(controller.uploadDocument(undefined as any)).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException for invalid file type', async () => {
      const mockFile = {
        originalname: 'test.txt',
        mimetype: 'text/plain',
        size: 1024,
        buffer: Buffer.from('test content'),
      } as Express.Multer.File;

      await expect(controller.uploadDocument(mockFile)).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException for file too large', async () => {
      const mockFile = {
        originalname: 'test.pdf',
        mimetype: 'application/pdf',
        size: 11 * 1024 * 1024, // 11MB
        buffer: Buffer.from('test content'),
      } as Express.Multer.File;

      await expect(controller.uploadDocument(mockFile)).rejects.toThrow(BadRequestException);
    });
  });
}); 