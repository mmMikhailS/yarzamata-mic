export const createOrderPromise = new Map();

export const actionPromise: { [key: string]: { get: (id: string) => any } } = {
  'create-order-response': {
    get(id: string) {
      return createOrderPromise.get(id);
    },
  },
};

export class Message {
  data: any;
  messageId: string;

  constructor(data: any, messageId: string) {
    (this.data = data), (this.messageId = messageId);
  }
}
