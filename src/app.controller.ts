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
  GetRecentChatsInput,
  SendMessageInput,
} from './types';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('check')
  check() {
    console.log('check-request');
    return this.appService.check();
  }

  @Post('connect')
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  connect(@Body() { userId }: ConnectWhatsappInput) {
    console.log('connect-request');
    return this.appService.connect({ userId });
  }

  @Post('send-message')
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  sendMessage(@Body() data: SendMessageInput) {
    console.log('message-request');
    return this.appService.sendMessage(data);
  }

  @Post('disconnect')
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  disconnect(
    @Body()
    data: DisconnectWhatsappInput,
  ) {
    console.log('disconnect-request');
    return this.appService.disconnect(data);
  }

  @Post('get-recent-chats')
  @UsePipes(
    new ValidationPipe({ whitelist: true, forbidNonWhitelisted: false }),
  )
  getRecentChats(
    @Body()
    data: GetRecentChatsInput,
  ) {
    console.log('get-recent-chats-request');
    return this.appService.getRecentChats(data);
  }

  @Get('')
  healthCheck() {
    console.log('health-check-request');
    return {
      v: '1.0.1',
      stable: true,
    };
  }
}
