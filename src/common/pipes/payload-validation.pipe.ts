import { ValidationException } from '@common/exceptions/exception-parser.filter';
import { ValidationPipe } from '@nestjs/common';
import { ValidationError } from 'class-validator';

export const PayloadValidationPipe = new ValidationPipe({
  skipMissingProperties: false,
  exceptionFactory: (errors: ValidationError[]) => {
    const errMsg = {};
    errors.forEach((err) => {
      errMsg[err.property] = [...Object.values(err.constraints)];
    });
    return new ValidationException(errMsg);
  },
});
