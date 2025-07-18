import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Document } from '../entities/document.entity';
import * as pdf from 'pdf-parse';
import * as csv from 'csv-parse';
import { Packer } from 'docx';

@Injectable()
export class DocumentProcessorService {
  constructor(
    @InjectRepository(Document)
    private documentRepository: Repository<Document>,
  ) {}

  async processDocument(documentId: number, fileBuffer: Buffer): Promise<void> {
    try {
      const document = await this.documentRepository.findOne({ where: { id: documentId } });
      if (!document) return;

      let extractedText = '';

      switch (document.fileType) {
        case 'application/pdf':
          extractedText = await this.extractPdfText(fileBuffer);
          break;
        case 'text/csv':
          extractedText = await this.extractCsvText(fileBuffer);
          break;
        case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
          extractedText = await this.extractDocxText(fileBuffer);
          break;
        default:
          throw new Error(`Unsupported file type: ${document.fileType}`);
      }

      await this.documentRepository.update(documentId, {
        extractedText,
        isProcessed: true,
      });
    } catch (error) {
      console.error(`Error processing document ${documentId}:`, error);
      await this.documentRepository.update(documentId, {
        isProcessed: false,
      });
    }
  }

  private async extractPdfText(buffer: Buffer): Promise<string> {
    const data = await pdf(buffer);
    return data.text;
  }

  private async extractCsvText(buffer: Buffer): Promise<string> {
    return new Promise((resolve, reject) => {
      const text = buffer.toString();
      csv.parse(text, (err, records) => {
        if (err) reject(err);
        else resolve(records.map(row => row.join(', ')).join('\n'));
      });
    });
  }

  private async extractDocxText(buffer: Buffer): Promise<string> {
    try {
      // For now, return a placeholder since docx parsing is complex
      // In a real implementation, you would use a proper DOCX parser
      return 'DOCX content extracted (placeholder)';
    } catch (error) {
      console.error('Error extracting DOCX text:', error);
      return 'Error extracting DOCX content';
    }
  }
} 