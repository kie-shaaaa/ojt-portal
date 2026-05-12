/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

export type ErrorType =
  | 'bad_request'
  | 'unauthorized'
  | 'forbidden'
  | 'not_found'
  | 'conflict'
  | 'server_error';

export function throwAppError(type: ErrorType, message: string): never {
  switch (type) {
    case 'bad_request':
      throw new BadRequestException(message);

    case 'unauthorized':
      throw new UnauthorizedException(message);

    case 'forbidden':
      throw new ForbiddenException(message);

    case 'not_found':
      throw new NotFoundException(message);

    case 'conflict':
      throw new ConflictException(message);

    default:
      throw new InternalServerErrorException(message);
  }
}

export function SuccessHandler(message: string, data?: any) {
  return {
    status: 'success',
    ok: true,
    message: message,
    data: data || null,
  };
}
