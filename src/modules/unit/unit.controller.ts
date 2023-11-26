import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
} from '@nestjs/common';
import { UnitService } from './unit.service';
import { ApiParam, ApiTags } from '@nestjs/swagger';
import { SearchForUnitsDto, UnitPayloadDto } from './unit.dto';
import { IdFrompayload } from '@common/types/params.types';

@ApiTags('Unit')
@Controller('unit')
export class UnitController {
  constructor(private readonly service: UnitService) {}

  @Get('find-all')
  findAll() {
    return this.service.findAll();
  }

  @ApiParam({ name: 'id', type: 'string' })
  @Get('find-one/:id')
  findOne(@Param() { id }: IdFrompayload) {
    return this.service.findOne(id);
  }

  @Post('find-many-by-criteria')
  findManyUnitsByCriteria(@Body() payload: SearchForUnitsDto) {
    return this.service.findManyUnitsByCriteria(payload);
  }

  @ApiParam({ name: 'id', type: 'string' })
  @Put('update/:id')
  update(@Param() { id }: IdFrompayload, @Body() payload: UnitPayloadDto) {
    return this.service.update(id, payload);
  }

  @ApiParam({ name: 'id', type: 'string' })
  @Delete('remove/:id')
  remove(@Param() { id }: IdFrompayload) {
    return this.service.removeOne(id);
  }
}
