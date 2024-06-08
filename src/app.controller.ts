import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import {
  ConnectWhatsappInput,
  DisconnectWhatsappInput,
  SendMessageInput,
} from './types';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('disconnectWhatsapp')
  check() {
    return this.appService.check();
  }

  @Post('connectWhatsapp')
  connect(@Body('data') data: ConnectWhatsappInput) {
    return this.appService.connect(data);
  }

  @Post('sendMessage')
  sendMessage(@Body('data') data: SendMessageInput) {
    return this.appService.sendMessage(data);
  }

  @Post('disconnectWhatsapp')
  disconnectWhatsapp(
    @Body('data')
    data: DisconnectWhatsappInput,
  ) {
    return this.appService.disconnect(data);
  }
}
