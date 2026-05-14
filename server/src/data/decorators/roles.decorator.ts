import { SetMetadata } from '@nestjs/common';

export const Roles = (...account_type: string[]) =>
  SetMetadata('account_type', account_type);
