import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('documents')
  async getAllDocuments() {
    return this.appService.getAllDocuments();
  }

  @Post('test-document')
  async createTestDocument() {
    return this.appService.createTestDocument();
  }
}
