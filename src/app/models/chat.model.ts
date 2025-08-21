export interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'doctor';
  timestamp: number;
}