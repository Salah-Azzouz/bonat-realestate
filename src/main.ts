import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestConfigService } from '@config/nest/nest.service';
import { SwaggerModule } from '@nestjs/swagger';
import { SwaggerDocBuilder } from '@config/swagger/swagger.utils';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const { port } = app.get(NestConfigService);

  app.enableCors();
  app.setGlobalPrefix('api');

  SwaggerModule.setup('doc', app, SwaggerDocBuilder(app));
  await app.listen(port);
}
bootstrap();
