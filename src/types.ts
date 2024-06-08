export interface ConnectWhatsappInput {
  userId: number;
}

export interface DisconnectWhatsappInput {
  userId: number;
}

export interface SendMessageInput {
  userId: number;
  message: string;
  leads: {
    id: number;
    name: string;
    phone: string;
  }[];
  file: any;
}

export interface SendMessageResponse {}

export interface WhatsappConnectionResponse {}
