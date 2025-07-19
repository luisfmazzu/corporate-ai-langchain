import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AppService } from './app.service';

@ApiTags('health')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({ summary: 'Get application welcome message' })
  @ApiResponse({ status: 200, description: 'Welcome message returned successfully' })
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('health')
  @ApiOperation({ summary: 'Get application health status' })
  @ApiResponse({ 
    status: 200, 
    description: 'Health status returned successfully',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string', example: 'healthy' },
        timestamp: { type: 'string', example: '2024-01-01T00:00:00.000Z' }
      }
    }
  })
  getHealth(): { status: string; timestamp: string } {
    return {
      status: 'healthy',
      timestamp: new Date().toISOString(),
    };
  }

  @Get('documents')
  @ApiOperation({ summary: 'Get list of all documents' })
  @ApiResponse({ status: 200, description: 'Documents list returned successfully' })
  async getAllDocuments() {
    return this.appService.getAllDocuments();
  }

  @Post('test-document')
  async createTestDocument() {
    return this.appService.createTestDocument();
  }
}
