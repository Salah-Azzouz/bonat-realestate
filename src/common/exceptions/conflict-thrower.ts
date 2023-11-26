import { HttpException, HttpStatus } from '@nestjs/common';

export class EntityConflictException extends HttpException {
  constructor(message: string) {
    super(message, HttpStatus.CONFLICT);
  }
}

export function ConflictThrower(message: string) {
  throw new EntityConflictException(message);
}
