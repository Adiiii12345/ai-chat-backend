import { Controller, Post, Body } from '@nestjs/common';
import { AppService } from './app.service';

@Controller('chat')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('ask')
  async askAi(@Body() body: { prompt: string, lang: string }) {
    const response = await this.appService.getAiResponse(body.prompt, body.lang);
    return { response };
  }
}