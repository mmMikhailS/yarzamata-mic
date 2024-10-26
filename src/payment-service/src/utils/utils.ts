
export class Message {
  data: any;
  messageId: string;

  constructor(data: any, messageId: string) {
    (this.data = data), (this.messageId = messageId);
  }
}
