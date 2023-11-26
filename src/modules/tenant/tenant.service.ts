import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Tenant } from '@schema/tenant.entity';
import { Repository } from 'typeorm';
import { TenantCreateDto } from './tenant.dto';
import { ConflictThrower } from '@common/exceptions/conflict-thrower';
import { LeaseStatusEnum } from '@common/enums/lease-status.enum';

@Injectable()
export class TenantService {
  constructor(
    @InjectRepository(Tenant)
    private readonly repository: Repository<Tenant>,
  ) {}

  async create(payload: TenantCreateDto) {
    await this.checkIfPhoneNumberIsUnique(payload.phone);
    return await this.repository.save(new Tenant(payload));
  }

  async findAll() {
    return await this.repository.find();
  }

  async findAllWithLeases() {
    return await this.repository.find({
      relations: { leases: true },
    });
  }

  async findAllWithSpecificLeaseStatus(status: LeaseStatusEnum) {
    return await this.repository.find({
      relations: { leases: true },
      where: {
        leases: {
          status: status,
        },
      },
    });
  }

  async findOne(id: string) {
    return await this.repository.findOneOrFail({
      where: { id },
    });
  }

  async update(id: string, payload: TenantCreateDto) {
    const entity = await this.findOne(id);
    await this.checkIfPhoneNumberIsUnique(payload.phone);
    Object.assign(entity, payload);
    return await entity.save();
  }

  async remove(id: string) {
    const entity = await this.findOne(id);
    return await this.repository.remove(entity);
  }

  async resetAll() {
    await this.repository.createQueryBuilder().delete().execute();
    return 'All tenants have been deleted';
  }

  async checkIfPhoneNumberIsUnique(phone: string) {
    const tenant = await this.repository.findOne({
      where: { phone },
    });
    tenant && ConflictThrower(`Phone number already exists`);
  }
}
