import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import type { FastifyRequest } from 'fastify';

const CSRF_TOKEN_COOKIE = 'csrf_token';
const CSRF_TOKEN_HEADER = 'x-csrf-token';

const SAFE_METHODS = new Set(['GET', 'HEAD', 'OPTIONS']);
const CSRF_EXEMPT_PATHS = new Set(['/auth/signin', '/auth/csrf']);

function getHeaderValue(
  request: FastifyRequest,
  headerName: string,
): string | undefined {
  const value = request.headers[headerName.toLowerCase()];
  return Array.isArray(value) ? value[0] : (value ?? undefined);
}

@Injectable()
export class CsrfGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    if (context.getType() !== 'http') return true;

    const request = context
      .switchToHttp()
      .getRequest<
        FastifyRequest & { cookies?: Record<string, string | undefined> }
      >();

    const method = (request.method || 'GET').toUpperCase();

    // 1. skip safe methods
    if (SAFE_METHODS.has(method)) return true;

    const pathname = request.url.split('?')[0] ?? '';

    // 2. skip exempt routes
    if (CSRF_EXEMPT_PATHS.has(pathname)) return true;

    // 3. read tokens
    const csrfCookie = request.cookies?.[CSRF_TOKEN_COOKIE];
    const csrfHeader = getHeaderValue(request, CSRF_TOKEN_HEADER);

    console.log('CSRF COOKIE:', csrfCookie);
    console.log('CSRF HEADER:', csrfHeader);

    // 4. enforce CSRF
    if (!csrfCookie || !csrfHeader) {
      throw new ForbiddenException('CSRF missing');
    }

    if (csrfCookie !== csrfHeader) {
      throw new ForbiddenException('CSRF validation failed');
    }

    return true;
  }
}
