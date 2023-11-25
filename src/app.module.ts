import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { NestConfigModule } from '@config/nest/nest.module';
import { PostgresConfigModule } from '@config/postgres/postgres.module';
import { HttpExceptionFilter } from '@common/exceptions/http-exception.filter';
import { APP_FILTER } from '@nestjs/core';

const IMPORTS = [
  ConfigModule.forRoot({ isGlobal: true }),
  NestConfigModule,
  PostgresConfigModule,
];
@Module({
  imports: [...IMPORTS],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
})
export class AppModule {}
