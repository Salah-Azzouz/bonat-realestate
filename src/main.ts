import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestConfigService } from '@config/nest/nest.service';
import { SwaggerModule } from '@nestjs/swagger';
import { SwaggerDocBuilder } from '@config/swagger/swagger.utils';
import { PayloadValidationPipe } from '@common/pipes/payload-validation.pipe';
import {
  ValidationException,
  ValidationFilter,
} from '@common/exceptions/exception-parser.filter';
import { NotFoundExceptionFilter } from '@common/exceptions/entity-no-found.exception';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const { port } = app.get(NestConfigService);

  app.enableCors();
  app.setGlobalPrefix('api');
  app.useGlobalFilters(new ValidationFilter());
  app.useGlobalFilters(new NotFoundExceptionFilter());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      exceptionFactory: (errors) => {
        let reformatedError = errors.map((error) => ({
          property: error.property,
          constraints: error.constraints,
        }));
        return new ValidationException(reformatedError);
      },
    }),
  );

  app.useGlobalPipes(PayloadValidationPipe);

  SwaggerModule.setup('doc', app, SwaggerDocBuilder(app));
  await app.listen(port);
}
bootstrap();
