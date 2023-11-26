import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { LeaseService } from './lease.service';
import { ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { LeaseCreateDto, LeaseUpdateDto } from './lease.dto';
import { IdFrompayload } from '@common/types/params.types';
import { LeaseStatusEnum } from '@common/enums/lease-status.enum';

@ApiTags('Lease')
@Controller('lease')
export class LeaseController {
  constructor(private readonly service: LeaseService) {}

  @Post()
  async leaseUnit(@Body() payload: LeaseCreateDto) {
    return this.service.leaseUnit(payload);
  }

  @Post('terminate')
  async terminateLease(@Body() { id }: IdFrompayload) {
    return this.service.terminateLease(id);
  }

  @Get('find-all')
  async findAll() {
    return this.service.findAll();
  }

  @ApiParam({ name: 'id', type: String })
  @Get('find-tenant-leases/:id')
  async findTenantLeases(@Param() { id }: IdFrompayload) {
    return this.service.findTenantLeases(id);
  }

  @ApiParam({ name: 'id', type: String })
  @Get('find-unit-leases/:id')
  async findUnitLeases(@Param() { id }: IdFrompayload) {
    return this.service.findUnitLeases(id);
  }

  @ApiParam({ name: 'id', type: String })
  @ApiQuery({ name: 'status', enum: LeaseStatusEnum })
  @Get('find-teant-leases-by-status/:id')
  async findTenantLeasesByStatus(
    @Param() { id }: IdFrompayload,
    @Query() { status }: { status: LeaseStatusEnum },
  ) {
    return this.service.findTenantLeasesByStatus(id, status);
  }

  @ApiParam({ name: 'id', type: String })
  @ApiQuery({ name: 'status', enum: LeaseStatusEnum })
  @Get('find-unit-leases-by-status/:id')
  async findUnitLeasesByStatus(
    @Param() { id }: IdFrompayload,
    @Query() { status }: { status: LeaseStatusEnum },
  ) {
    return this.service.findUnitLeasesByStatus(id, status);
  }

  @ApiQuery({ name: 'status', enum: LeaseStatusEnum })
  @Get('find-lease-by-status')
  async findLeaseByStatus(@Query() { status }: { status: LeaseStatusEnum }) {
    return this.service.findManyLeasesByStatus(status);
  }

  @ApiParam({ name: 'id', type: String })
  @Get('find-lease-by-id/:id')
  async findLeaseById(@Param() { id }: IdFrompayload) {
    return this.service.findOne(id);
  }

  @ApiParam({ name: 'id', type: String })
  @Patch('update-lease/:id')
  async updateLease(
    @Param() { id }: IdFrompayload,
    @Body() payload: LeaseUpdateDto,
  ) {
    return this.service.update(id, payload);
  }

  @ApiParam({ name: 'id', type: String })
  @Delete('delete-lease/:id')
  async deleteLease(@Param() { id }: IdFrompayload) {
    return this.service.delete(id);
  }
}
