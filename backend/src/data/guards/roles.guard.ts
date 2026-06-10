import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';

import { Reflector } from '@nestjs/core';
import { Token } from '../types';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    console.log('ROLES GUARD HIT');
    const requiredRoles = this.reflector.get<string[]>(
      'account_type',
      context.getHandler(),
    );

    if (!requiredRoles) return true;

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const request = context.switchToHttp().getRequest();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const user = request.user as Token;
    console.log('USER', user);

    if (!user) return false;
    if (!user.account_type) return false;

    return requiredRoles.includes(user.account_type);
  }
}
