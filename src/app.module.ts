import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { NestConfigModule } from '@config/nest/nest.module';
import { PostgresConfigModule } from '@config/postgres/postgres.module';
import { HttpExceptionFilter } from '@common/exceptions/http-exception.filter';
import { APP_FILTER } from '@nestjs/core';
import { PropertyModule } from '@modules/property/property.module';
import { TenantModule } from '@modules/tenant/tenant.module';
import { UnitModule } from '@modules/unit/unit.module';
import { LeaseModule } from '@modules/lease/lease.module';

const CONFIG_IMPORTS = [
  ConfigModule.forRoot({ isGlobal: true }),
  NestConfigModule,
  PostgresConfigModule,
];

const MODULE_IMPORTS = [PropertyModule, TenantModule, UnitModule, LeaseModule];
@Module({
  imports: [...CONFIG_IMPORTS, ...MODULE_IMPORTS],
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
