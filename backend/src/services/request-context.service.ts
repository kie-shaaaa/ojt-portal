import { Injectable } from '@nestjs/common';
import { AsyncLocalStorage } from 'node:async_hooks';

export type RequestContextData = {
  userId?: number;
  ipAddress?: string;
};

@Injectable()
export class RequestContextService {
  private readonly storage = new AsyncLocalStorage<RequestContextData>();

  enter(context: RequestContextData): void {
    this.storage.enterWith(context);
  }

  getUserId(): number | undefined {
    return this.storage.getStore()?.userId;
  }

  getIpAddress(): string | undefined {
    return this.storage.getStore()?.ipAddress;
  }
}
