export const subscribeTopics = [
  'register-user',
  'login-user',
  'change-password',
  'refresh',
  'activate-account',
] as const;

export class Message {
  data: any;
  messageId: string;

  constructor(data: any, messageId: string) {
    (this.data = data), (this.messageId = messageId);
  }
}
