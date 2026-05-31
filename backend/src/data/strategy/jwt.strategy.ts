import { Injectable, UnauthorizedException, type Type } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { AuthenticatedUser, JwtPayload } from '../interfaces';
import { DatabaseService } from '../../services/database/database.service';

const PassportJwtStrategy = Strategy as Type<unknown>;

const ACCESS_TOKEN_COOKIE = 'access_token';

function requireJwtSecret(): string {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error('JWT_SECRET is missing');
  }

  return secret;
}

type JwtFromRequestFunction = (
  request: {
    cookies?: { access_token?: string };
    headers?: { authorization?: string };
  } | null,
) => string | null;

const bearerTokenExtractor: JwtFromRequestFunction = (
  request: {
    cookies?: { access_token?: string };
    headers?: { authorization?: string };
  } | null,
): string | null => {
  const cookieToken = request?.cookies?.[ACCESS_TOKEN_COOKIE];

  if (cookieToken) return cookieToken;

  const authorizationHeader = request?.headers?.authorization;

  if (!authorizationHeader) return null;

  const [scheme, token] = authorizationHeader.split(' ');

  if (scheme?.toLowerCase() !== 'bearer' || !token) return null;

  return token;
};

@Injectable()
export class JwtStrategy extends PassportStrategy(PassportJwtStrategy, 'jwt') {
  constructor(private readonly databaseService: DatabaseService) {
    super({
      jwtFromRequest: bearerTokenExtractor,
      secretOrKey: requireJwtSecret(),
      issuer: 'ntc-ojt-auth',
      audience: 'ntc-ojt-web',
      algorithms: ['HS256'],
    });
  }

  async validate(payload: JwtPayload): Promise<AuthenticatedUser> {
    const client = this.databaseService.getClient();
    const result = await client.query<AuthenticatedUser>(
      `
        SELECT id as "id", email, account_type
        FROM user_accounts
        WHERE id = $1
          AND email = $2
          AND account_type = $3
          AND account_status = 'active'
        LIMIT 1;
      `,
      [payload.sub, payload.email, payload.account_type],
    );

    const user = result.rows[0];

    if (!user) {
      throw new UnauthorizedException('Invalid or expired token');
    }

    return user;
  }
}
