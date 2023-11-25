import { Module } from '@nestjs/common';
import configuration from './nest.provider';
import { NestConfigService } from './nest.service';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
    }),
  ],
  providers: [ConfigService, NestConfigService],
  exports: [ConfigService, NestConfigService],
})
export class NestConfigModule {}
