import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { PropertyService } from './property.service';
import { ApiParam, ApiTags } from '@nestjs/swagger';
import {
  AddUnitsToPropertyDto,
  PropertyCreateDto,
  PropertyUpdateDto,
} from './property.dto';
import { IdFrompayload } from '@common/types/params.types';

@ApiTags('Property')
@Controller('property')
export class PropertyController {
  constructor(private readonly services: PropertyService) {}

  @Post('create')
  create(@Body() payload: PropertyCreateDto) {
    return this.services.createPropertyWithUnits(payload);
  }

  @Get('find-all/with-units')
  findAllWithUnits() {
    return this.services.findAllWithUnits();
  }

  @Get('find-all/without-units')
  findAllWithoutUnits() {
    return this.services.findAllWithoutUnits();
  }

  @Get('find-one/:id')
  findOne(@Param() { id }: IdFrompayload) {
    return this.services.findOne(id);
  }

  @ApiParam({ name: 'id', type: 'string' })
  @Patch('update/:id')
  update(@Param() { id }: IdFrompayload, @Body() payload: PropertyUpdateDto) {
    return this.services.update(id, payload);
  }

  @ApiParam({ name: 'id', type: 'string' })
  @Patch('add-units/:id')
  addUnits(
    @Param() { id }: IdFrompayload,
    @Body() { units }: AddUnitsToPropertyDto,
  ) {
    return this.services.addUnits(id, units);
  }

  @ApiParam({ name: 'id', type: 'string' })
  @Delete('remove/:id')
  remove(@Param() { id }: IdFrompayload) {
    return this.services.removeOne(id);
  }

  @Delete('reset-all')
  resetAll() {
    return this.services.resetAll();
  }
}
