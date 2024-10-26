export const registrationPromise = new Map();
export const loginPromise = new Map();
export const changePasswordPromise = new Map();
export const refreshPromise = new Map();
export const activateAccountPromise = new Map();

export const responseTopics = [
  'register-user-response',
  'login-user-response',
  'change-password-response',
  'refresh-response',
  'activate-account-response',
] as const;

export type topicsType =
  | 'register-user'
  | 'login-user'
  | 'change-password'
  | 'refresh'
  | 'activate-account';

export const topics = [
  'register-user',
  'login-user',
  'change-password',
  'refresh',
  'activate-account',
] as const;

export const actionPromise: { [key: string]: { get: (id: string) => any } } = {
  'register-user-response': {
    get(id: string) {
      return registrationPromise.get(id);
    },
  },
  'login-user-response': {
    get(id: string) {
      return loginPromise.get(id);
    },
  },
  'change-password-response': {
    get(id: string) {
      return changePasswordPromise.get(id);
    },
  },
  'refresh-response': {
    get(id: string) {
      return refreshPromise.get(id);
    },
  },
  'activate-account-response': {
    get(id: string) {
      return activateAccountPromise.get(id);
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