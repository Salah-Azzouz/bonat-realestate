import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { TenantService } from './tenant.service';
import { ApiParam, ApiTags } from '@nestjs/swagger';
import { TenantCreateDto } from './tenant.dto';
import { LeaseStatusEnum } from '@common/enums/lease-status.enum';
import { IdFrompayload } from '@common/types/params.types';

@ApiTags('Tenant')
@Controller('tenant')
export class TenantController {
  constructor(private readonly service: TenantService) {}

  @Post('create')
  create(@Body() createTenantDto: TenantCreateDto) {
    return this.service.create(createTenantDto);
  }

  @Get('find-all')
  findAll() {
    return this.service.findAll();
  }

  @Get('find-all-with-leases')
  findAllWithLeases() {
    return this.service.findAllWithLeases();
  }

  @ApiParam({ name: 'status', enum: LeaseStatusEnum })
  @Get('find-with-specific-lease-status/:status')
  findAllWithSpecificLeaseStatus(@Param('status') status: LeaseStatusEnum) {
    return this.service.findAllWithSpecificLeaseStatus(status);
  }

  @ApiParam({ name: 'id', type: 'string' })
  @Get('find-one/:id')
  findOne(@Param() { id }: IdFrompayload) {
    return this.service.findOne(id);
  }

  @ApiParam({ name: 'id', type: 'string' })
  @Put('update/:id')
  update(
    @Param() { id }: IdFrompayload,
    @Body() updateTenantDto: TenantCreateDto,
  ) {
    return this.service.update(id, updateTenantDto);
  }

  @ApiParam({ name: 'id', type: 'string' })
  @Delete('remove/:id')
  remove(@Param() { id }: IdFrompayload) {
    return this.service.remove(id);
  }

  @Delete('reset-all')
  resetAll() {
    return this.service.resetAll();
  }
}
