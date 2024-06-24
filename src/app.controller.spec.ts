import { Test, TestingModule } from '@nestjs/testing';
import { Client, NoAuth, WAState } from 'whatsapp-web.js';
import { AppService } from './app.service';
import { EState } from './enums';

jest.mock('whatsapp-web.js');

describe('AppService', () => {
  let service: AppService;
  let mockClient: jest.Mocked<Client>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AppService],
    }).compile();

    service = module.get<AppService>(AppService);
    mockClient = new Client({
      authStrategy: new NoAuth(),
      puppeteer: { headless: true },
    }) as unknown as jest.Mocked<Client>;

    service.clientData.client = mockClient;
    service.clientData.userId = 1;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('connect', () => {
    it('should create a new client and return QR code', async () => {
      const userId = 1;
      const mockQR = 'mocked-qr-code';
      service.clientData.qr = mockQR;

      jest.spyOn(mockClient, 'initialize').mockImplementation(async () => {
        service.clientData.state = EState.OPENING;
      });

      mockClient.on = jest.fn().mockImplementation((event, callback) => {
        if (event === 'qr') {
          callback(mockQR);
        }
        if (event === 'ready') {
          service.clientData.state = EState.CONNECTED;
        }
      });

      // (Client as unknown as jest.Mock).mockReturnValue(mockClient);

      const result = await service.connect({ userId });

      expect(result.qrCode).toBe(mockQR);
      expect(service.clientData.client).toBeDefined();
    });
  });

  describe('disconnect', () => {
    it('should disconnect the client and update the state', async () => {
      const userId = 1;
      const mockClient = new Client({
        authStrategy: new NoAuth(),
        puppeteer: { headless: true },
      });

      mockClient.pupBrowser = {
        close: jest.fn(),
      } as any;

      service.clientData.client = mockClient;
      service.clientData.state = EState.CONNECTED;
      service.clientData.userId = userId;

      jest.spyOn(mockClient, 'getState').mockResolvedValue(WAState.CONNECTED);

      const result = await service.disconnect({ userId });

      expect(mockClient.pupBrowser.close).toHaveBeenCalledTimes(1);
      expect(service.clientData.client).toBeUndefined();
      expect(service.clientData.state).toBe(EState.UNLAUNCHED);
      expect(result.isConnected).toBe(false);
      expect(result.message).toBe('Desconectado com sucesso.');
    });
  });

  describe('sendMessage', () => {
    it('should send messages to leads', async () => {
      const userId = 1;
      const mockClient = new Client({
        authStrategy: new NoAuth(),
        puppeteer: { headless: true },
      });

      mockClient.sendMessage = jest.fn();

      service.clientData.client = mockClient;
      service.clientData.state = EState.CONNECTED;
      service.clientData.userId = userId;

      const input = {
        userId,
        message: 'Hello $[NOME]',
        leads: [{ name: 'John Doe', phone: '123456789', id: 1 }],
        file: null,
      };

      const result = await service.sendMessage(input);

      expect(mockClient.sendMessage).toHaveBeenCalledWith(
        '55123456789@c.us',
        'Hello John',
      );
      expect(result.succeeded).toBe(true);
    });
  });

  describe('getRecentChats', () => {
    it('should return recent chats excluding groups', async () => {
      const mockClient = new Client({
        authStrategy: new NoAuth(),
        puppeteer: { headless: true },
      });
      service.clientData.state = EState.CONNECTED;
      service.clientData.client = mockClient;

      const mockChats = [
        {
          isGroup: true,
          id: { user: 'group1' },
          name: 'Group 1',
        },
        {
          isGroup: false,
          id: { user: '123456789' },
          name: '',
          getContact: jest.fn().mockResolvedValue({
            name: 'John Doe',
            pushname: '',
          }),
        },
        {
          isGroup: false,
          id: { user: '987654321' },
          name: 'Jane Smith',
          getContact: jest.fn().mockResolvedValue({
            name: 'Jane Smith',
            pushname: '',
          }),
        },
      ];

      jest.spyOn(mockClient, 'getChats').mockResolvedValue(mockChats as any);

      const result = await service.getRecentChats();

      expect(result).toEqual([
        { nome: 'John Doe', telefone: '123456789' },
        { nome: 'Jane Smith', telefone: '987654321' },
      ]);
    });

    it('should throw an error if client is not connected', async () => {
      service.clientData.state = EState.UNLAUNCHED;

      await expect(service.getRecentChats()).rejects.toThrow('Sem conexão.');
    });
  });
});
