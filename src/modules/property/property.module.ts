import { Module } from '@nestjs/common';
import { PropertyService } from './property.service';
import { PropertyController } from './property.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UnitModule } from '../unit/unit.module';
import { Property } from '@schema/property.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Property]), UnitModule],
  controllers: [PropertyController],
  providers: [PropertyService],
})
export class PropertyModule {}
