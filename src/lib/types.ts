export type EmailType = 'customer' | 'wilson' | 'carrier' | 'tracking';

export type BadgeType = 'NEW' | 'QUOTE' | 'RECOMMEND' | 'BOOKED' | 'URGENT';

export interface EmailThread {
  id: number;
  type: EmailType;
  from: string;
  email: string;
  subject: string;
  preview: string;
  body: string;
  timestamp: string;
  badge?: BadgeType;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  message: string;
}
