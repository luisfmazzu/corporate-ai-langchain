import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Document } from '../entities/document.entity';
import { DocumentProcessorService } from '../document-processor/document-processor.service';

@Injectable()
export class UploadService {
  constructor(
    @InjectRepository(Document)
    private documentRepository: Repository<Document>,
    private documentProcessorService: DocumentProcessorService,
  ) {}

  async processDocument(file: Express.Multer.File): Promise<{ documentId: number; status: string }> {
    const document = this.documentRepository.create({
      fileName: file.originalname,
      fileType: file.mimetype,
      fileSize: file.size,
      isProcessed: false,
    });

    const savedDocument = await this.documentRepository.save(document);

    // Process document asynchronously
    this.documentProcessorService.processDocument(savedDocument.id, file.buffer);

    return {
      documentId: savedDocument.id,
      status: 'Processing',
    };
  }
} 