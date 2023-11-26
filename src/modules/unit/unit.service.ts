import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Unit } from '@schema/unit.entity';
import { Between, Repository } from 'typeorm';
import { Property } from '@schema/property.entity';
import { SearchForUnitsDto, UnitPayloadDto } from './unit.dto';

@Injectable()
export class UnitService {
  constructor(
    @InjectRepository(Unit)
    private readonly repository: Repository<Unit>,
  ) {}

  async findAll() {
    return await this.repository.find();
  }

  async findManyUnitsByCriteria(criteria: SearchForUnitsDto) {
    return await this.repository.find({
      where: {
        type: criteria.type,
        numberOfRooms: Between(
          criteria.minNumberOfRooms,
          criteria.maxNumberOfRooms,
        ),
        pricePerSquareMeter: Between(
          criteria.minPricePerSquareMeter,
          criteria.maxPricePerSquareMeter,
        ),
      },
    });
  }

  async findOne(id: string) {
    return await this.repository.findOneOrFail({
      where: { id },
    });
  }

  async update(id: string, payload: UnitPayloadDto) {
    const entity = await this.repository.findOneOrFail({
      where: { id },
    });
    Object.assign(entity, payload);
    return await entity.save();
  }

  async removeOne(id: string) {
    const entity = await this.repository.findOneOrFail({
      where: { id },
    });
    await this.checkForActiveLeases(id);
    return await this.repository.remove(entity);
  }

  async checkForActiveLeases(id: string) {
    const entity = await this.repository
      .createQueryBuilder('unit')
      .leftJoinAndSelect('unit.leases', 'leases')
      .where('unit.id = :id', { id })
      .andWhere('leases.status = :status', { status: 'active' })
      .getOne();
    if (entity) {
      throw new Error('Cannot delete a unit with active leases');
    }
    return entity;
  }

  async saveManyByProperty(property: Property, units: UnitPayloadDto[]) {
    const entities = units.map((unit) => {
      return this.repository.create({
        ...unit,
        property,
      });
    });
    return await this.repository.save(entities);
  }
}
