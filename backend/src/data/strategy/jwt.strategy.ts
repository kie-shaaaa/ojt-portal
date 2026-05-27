import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, type JwtFromRequestFunction } from 'passport-jwt';
import { AuthenticatedUser, JwtPayload } from '../interfaces';

type PassportJwtStrategyOptions = {
  jwtFromRequest: JwtFromRequestFunction;
  secretOrKey: string;
};

type PassportJwtStrategyConstructor = new (
  options: PassportJwtStrategyOptions,
) => unknown;

const PassportJwtStrategy =
  Strategy as unknown as PassportJwtStrategyConstructor;

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
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor() {
    const strategyOptions: PassportJwtStrategyOptions = {
      jwtFromRequest: bearerTokenExtractor,
      secretOrKey: process.env.JWT_SECRET as string,
    };

    super(strategyOptions);
  }

  validate(payload: JwtPayload): AuthenticatedUser {
    return {
      id: payload.sub,
      email: payload.email,
      account_type: payload.account_type,
    };
  }
}
