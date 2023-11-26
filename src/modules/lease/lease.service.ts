import { TenantService } from '@modules/tenant/tenant.service';
import { UnitService } from '@modules/unit/unit.service';
import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Lease } from '@schema/lease.entity';
import { LessThan, Repository } from 'typeorm';
import { LeaseCreateDto, LeaseUpdateDto } from './lease.dto';
import { LeaseStatusEnum } from '@common/enums/lease-status.enum';
import { ConflictThrower } from '@common/exceptions/conflict-thrower';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class LeaseService {
  constructor(
    @InjectRepository(Lease)
    private readonly repository: Repository<Lease>,
    @Inject(UnitService)
    private readonly unitService: UnitService,
    @Inject(TenantService)
    private readonly tenantService: TenantService,
  ) {}

  async leaseUnit(payload: LeaseCreateDto) {
    const unit = await this.unitService.findOne(payload.unitId);
    const tenant = await this.tenantService.findOne(payload.tenantId);
    await this.checkForAvailability(
      payload.unitId,
      payload.leaseStart,
      payload.leaseEnd,
    );
    return await this.repository.save({
      ...payload,
      tenant,
      unit,
    });
  }

  async terminateLease(id: string) {
    const lease = await this.repository.findOneOrFail({
      where: { id },
    });
    if (lease.status === LeaseStatusEnum.TERMINATED) {
      ConflictThrower('Lease is already terminated');
    }
    lease.status = LeaseStatusEnum.TERMINATED;
    lease.leaseEnd = new Date();
    return await lease.save();
  }

  async checkForAvailability(unitId: string, leaseStart: Date, leaseEnd: Date) {
    const lease = await this.repository
      .createQueryBuilder('lease')
      .leftJoinAndSelect('lease.unit', 'unit')
      .where('unit.id = :unitId')
      .andWhere('lease.leaseStart < :leaseEnd')
      .andWhere('lease.leaseEnd > :leaseStart')
      .andWhere('lease.status = :status')
      .setParameters({
        unitId,
        status: LeaseStatusEnum.ACTIVE,
        leaseStart,
        leaseEnd,
      })
      .getOne();
    if (lease) ConflictThrower('Unit is not available for this period');
  }

  async findAll() {
    return await this.repository.find({
      relations: { unit: true, tenant: true },
    });
  }

  async findTenantLeases(id: string) {
    return await this.repository.find({
      where: { tenant: { id } },
    });
  }

  async findTenantLeasesByStatus(id: string, status: LeaseStatusEnum) {
    return await this.repository.find({
      where: { tenant: { id }, status },
      relations: { unit: true, tenant: true },
    });
  }

  async findUnitLeases(id: string) {
    return await this.repository.find({
      where: { unit: { id } },
    });
  }

  async findUnitLeasesByStatus(id: string, status: LeaseStatusEnum) {
    return await this.repository.find({
      where: { unit: { id }, status },
      relations: { unit: true, tenant: true },
    });
  }

  async findManyLeasesByStatus(status: LeaseStatusEnum) {
    return await this.repository.find({
      where: { status },
      relations: { unit: true, tenant: true },
    });
  }

  async delete(id: string) {
    const entity = await this.repository.findOneOrFail({
      where: { id },
    });
    return await this.repository.remove(entity);
  }

  async findOne(id: string) {
    return await this.repository.findOneOrFail({
      where: { id },
      relations: { unit: true, tenant: true },
    });
  }

  async update(id: string, payload: LeaseUpdateDto) {
    const entity = await this.repository
      .createQueryBuilder('lease')
      .leftJoinAndSelect('lease.unit', 'unit')
      .where('lease.id = :id')
      .setParameters({ id })
      .select(['lease', 'unit.id'])
      .getOne();
    await this.checkForAvailability(
      entity.unit.id,
      payload.leaseStart,
      payload.leaseEnd,
    );
    Object.assign(entity, payload);
    return await entity.save();
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async setLeaseStatusToExpired() {
    const leases = await this.repository.find({
      where: { leaseEnd: LessThan(new Date()), status: LeaseStatusEnum.ACTIVE },
    });
    leases.forEach(async (lease) => {
      lease.status = LeaseStatusEnum.EXPIRED;
      await lease.save();
    });
  }
}
