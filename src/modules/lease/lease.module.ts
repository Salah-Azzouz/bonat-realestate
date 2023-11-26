import { Module } from '@nestjs/common';
import { LeaseService } from './lease.service';
import { LeaseController } from './lease.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TenantModule } from '../tenant/tenant.module';
import { UnitModule } from '../unit/unit.module';
import { Lease } from '@schema/lease.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Lease]), TenantModule, UnitModule],
  controllers: [LeaseController],
  providers: [LeaseService],
})
export class LeaseModule {}
