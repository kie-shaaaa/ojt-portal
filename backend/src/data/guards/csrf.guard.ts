import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import type { FastifyRequest } from 'fastify';
import { timingSafeEqual } from 'crypto';

const ACCESS_TOKEN_COOKIE = 'access_token';
const CSRF_TOKEN_COOKIE = 'csrf_token';
const CSRF_TOKEN_HEADER = 'x-csrf-token';

const SAFE_METHODS = new Set(['GET', 'HEAD', 'OPTIONS']);
const CSRF_EXEMPT_PATHS = new Set(['/auth/signin']);

function getHeaderValue(
  request: FastifyRequest,
  headerName: string,
): string | undefined {
  const value = request.headers[headerName.toLowerCase()];

  if (Array.isArray(value)) {
    return value[0];
  }

  return typeof value === 'string' ? value : undefined;
}

function isEqualToken(expected: string, actual: string): boolean {
  try {
    const expectedBuffer = Buffer.from(expected);
    const actualBuffer = Buffer.from(actual);

    if (expectedBuffer.length !== actualBuffer.length) {
      return false;
    }

    return timingSafeEqual(expectedBuffer, actualBuffer);
  } catch {
    return false;
  }
}

@Injectable()
export class CsrfGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    if (context.getType() !== 'http') {
      return true;
    }

    const request = context.switchToHttp().getRequest<
      FastifyRequest & {
        cookies?: Record<string, string | undefined>;
      }
    >();

    const method = (request.method || 'GET').toUpperCase();

    if (SAFE_METHODS.has(method)) {
      return true;
    }

    const pathname = request.url.split('?')[0] ?? '';

    if (CSRF_EXEMPT_PATHS.has(pathname)) {
      return true;
    }

    const authToken = request.cookies?.[ACCESS_TOKEN_COOKIE];

    if (!authToken) {
      return true;
    }

    const csrfCookie = request.cookies?.[CSRF_TOKEN_COOKIE];
    const csrfHeader = getHeaderValue(request, CSRF_TOKEN_HEADER);

    if (!csrfCookie || !csrfHeader || !isEqualToken(csrfCookie, csrfHeader)) {
      throw new ForbiddenException('CSRF validation failed');
    }

    return true;
  }
}
