import { Injectable } from '@nestjs/common';
import WAWebJS, { Client, MessageMedia, NoAuth } from 'whatsapp-web.js';
import {
  ConnectWhatsappInput,
  DisconnectWhatsappInput,
  SendMessageInput,
  SendMessageResponse,
  WhatsappConnectionResponse,
} from './types';

export interface IClientData {
  client: Client | undefined;
  state: WAWebJS.WAState;
  qr: string | undefined;
  userId: number;
}

@Injectable()
export class AppService {
  public clientData: IClientData = {
    state: WAWebJS.WAState.UNLAUNCHED,
    qr: undefined,
    client: undefined,
    userId: undefined,
  };

  async disconnect({
    userId,
  }: DisconnectWhatsappInput): Promise<WhatsappConnectionResponse> {
    const client = this.clientData.client;
    if (!client?.pupBrowser)
      return {
        isConnected: false,
        message: 'Não está conectado.',
      };

    const state = await client.getState();

    if (state === WAWebJS.WAState.CONNECTED) {
      await client.pupBrowser.close();
    } else {
      client.removeAllListeners();
      client.pupBrowser.close();
    }

    this.clientData = {
      client: undefined,
      qr: undefined,
      state: WAWebJS.WAState.UNLAUNCHED,
      userId,
    };

    return {
      isConnected: false,
      message: 'Desconectado com sucesso.',
    };
  }

  async sendMessage({
    userId: inputUserId,
    message,
    leads,
    file,
  }: SendMessageInput): Promise<SendMessageResponse> {
    const { client, userId } = this.clientData;
    if (inputUserId !== userId) throw new Error('Forbidden.');
    if (!client) throw new Error('Sem conexão.');

    const imageBuffer = file ? Buffer.from(file.buffer, 'base64') : null;
    const media = imageBuffer
      ? new MessageMedia(file.mimetype, imageBuffer.toString('base64'))
      : null;

    for (const lead of leads) {
      if (!lead.phone) {
        console.log('No phone provided for client: ' + lead.name);
        continue;
      }
      const name = lead.name.split(' ')[0].toLowerCase();
      const formatedName = name.charAt(0).toUpperCase() + name.slice(1);
      const format1 = message.replace('$[NOME]', formatedName);

      if (lead.phone!.length < 8) {
        console.log('Invalid phone number: ' + lead.phone);
        continue;
      }

      if (lead.phone) {
        if (media)
          await client.sendMessage(
            `55${lead.phone.toString().trim()}@c.us`,
            message,
            {
              media,
            },
          );
        else
          await client.sendMessage(
            `55${lead.phone?.toString().trim()}@c.us`,
            format1,
          );
        console.log('Sending message to: ' + lead.phone);
      }
      await new Promise((resolve) =>
        setTimeout(resolve, 700 + Math.random() * 700),
      ); ///// WAITS FOR 1 SECOND TO PREVENT WHATSAPP BUG FOR SENDING TOO MANY MSGS
    }

    return { succeeded: true };
  }

  async connect({ userId }: ConnectWhatsappInput): Promise<{
    isConnected: boolean;
    qrCode: string;
    message?: string;
  }> {
    const { client } = this.clientData;

    if (!client) {
      const newClient = new Client({
        authStrategy: new NoAuth(),
        puppeteer: {
          headless: true,
          args: [
            '--no-sandbox',
            '--no-experiments',
            '--hide-scrollbars',
            '--disable-plugins',
            '--disable-infobars',
            '--disable-translate',
            '--disable-pepper-3d',
            '--disable-extensions',
            '--disable-dev-shm-usage',
            '--disable-notifications',
            '--disable-setuid-sandbox',
            '--disable-crash-reporter',
            '--disable-smooth-scrolling',
            '--disable-login-animations',
            '--disable-dinosaur-easter-egg',
            '--disable-accelerated-2d-canvas',
            '--disable-rtc-smoothness-algorithm',
          ],
        },
        webVersionCache: {
          type: 'remote',
          remotePath:
            'https://raw.githubusercontent.com/wppconnect-team/wa-version/main/html/2.2412.54.html',
        },
      });
      this.clientData.client = newClient;
      console.log(`🎠 client created for user: ${userId}`);
      client.initialize();
      console.log(`🎠 client initialized for user: ${userId}`);

      this.clientData.state = WAWebJS.WAState.OPENING;

      client.on('loading_screen', (percent, message) => {
        console.log('client-' + userId + ' LOADING SCREEN', percent, message);
        this.clientData.state = WAWebJS.WAState.PAIRING;
      });
      client.on('authenticated', () => {
        console.log('client-' + userId + ' AUTHENTICATED');
        this.clientData.state = WAWebJS.WAState.PAIRING;
      });
      client.on('auth_failure', (msg) => {
        console.error('client-' + userId + ' AUTHENTICATION FAILURE', msg);
        this.clientData.state = WAWebJS.WAState.CONFLICT;
      });
      client.on('ready', async () => {
        console.log('client-' + userId + ' READY');
        this.clientData.state = WAWebJS.WAState.CONNECTED;
      });

      client.on('disconnected', async () => {
        this.clientData.state = WAWebJS.WAState.UNLAUNCHED;
        this.clientData.client = undefined;
        console.log('client-' + userId + ' disconnected.');
      });

      console.log(`🎈 getting qrcode for user: ${userId}`);

      const qrCode: string = await new Promise((resolve) => {
        client.on('qr', async (qr) => {
          console.log('client-' + userId + ' qr acquired');
          this.clientData.state = WAWebJS.WAState.UNPAIRED_IDLE;
          this.clientData.qr = qr;
          resolve(qr);
        });
      });

      return {
        isConnected: false,
        qrCode,
      };
    }

    return {
      isConnected: true,
      qrCode: this.clientData.qr,
    };
  }

  async check(): Promise<{
    qr: string;
    state: WAWebJS.WAState;
  }> {
    const { state, qr } = this.clientData;
    return {
      qr,
      state,
    };
  }
}