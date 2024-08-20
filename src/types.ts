import { IsNotEmpty } from 'class-validator';
import { Label } from 'whatsapp-web.js';

export class ConnectWhatsappInput {
  @IsNotEmpty({ message: 'userId is required' })
  userId: number;
}

export class DisconnectWhatsappInput {
  @IsNotEmpty({ message: 'userId is required' })
  userId: number;
}

export class SendMessageInput {
  @IsNotEmpty({ message: 'userId is required' })
  userId: number;
  @IsNotEmpty({ message: 'message is required' })
  message: string;
  @IsNotEmpty({ message: 'leads is required' })
  leads: {
    id: number;
    name: string;
    phone: string;
  }[];
  file?: any;
}

export class SendMessageResponse {
  succeeded: boolean;
}

export class WhatsappConnectionResponse {
  isConnected: boolean;
  message: string;
}

export class GetRecentChatsInput {
  labels?: string[];
}

export class ChatLead {
  name: string;
  phone: string;
  labels: Label[];
}
