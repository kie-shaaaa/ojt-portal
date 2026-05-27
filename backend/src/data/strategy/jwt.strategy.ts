import { Injectable, type Type } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { AuthenticatedUser, JwtPayload } from '../interfaces';

const PassportJwtStrategy = Strategy as Type<unknown>;

type JwtFromRequestFunction = (
  request: {
    headers?: { authorization?: string };
  } | null,
) => string | null;

const bearerTokenExtractor: JwtFromRequestFunction = (
  request: {
    headers?: { authorization?: string };
  } | null,
): string | null => {
  const authorizationHeader = request?.headers?.authorization;

  if (!authorizationHeader) return null;

  const [scheme, token] = authorizationHeader.split(' ');

  if (scheme?.toLowerCase() !== 'bearer' || !token) return null;

  return token;
};

@Injectable()
export class JwtStrategy extends PassportStrategy(PassportJwtStrategy, 'jwt') {
  constructor() {
    super({
      jwtFromRequest: bearerTokenExtractor,
      secretOrKey: process.env.JWT_SECRET ?? '',
    });
  }

  validate(payload: JwtPayload): AuthenticatedUser {
    return {
      id: payload.sub,
      email: payload.email,
      account_type: payload.account_type,
    };
  }
}
