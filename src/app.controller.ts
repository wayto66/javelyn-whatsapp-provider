import {
  Body,
  Controller,
  Get,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AppService } from './app.service';
import {
  ConnectWhatsappInput,
  DisconnectWhatsappInput,
  SendMessageInput,
} from './types';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('check')
  check() {
    return this.appService.check();
  }

  @Post('connect')
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  connect(@Body() { userId }: ConnectWhatsappInput) {
    return this.appService.connect({ userId });
  }

  @Post('send-message')
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  sendMessage(@Body() data: SendMessageInput) {
    return this.appService.sendMessage(data);
  }

  @Post('disconnect')
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  disconnect(
    @Body('data')
    data: DisconnectWhatsappInput,
  ) {
    return this.appService.disconnect(data);
  }
}
