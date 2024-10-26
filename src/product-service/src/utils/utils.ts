export const topics = [
  'get-all-products',
  'create-product',
  'create-product-type',
  'delete-product',
  'delete-product-type',
];

export class Message {
  data: any;
  messageId: string;

  constructor(data: any, messageId: string) {
    (this.data = data), (this.messageId = messageId);
  }
}
