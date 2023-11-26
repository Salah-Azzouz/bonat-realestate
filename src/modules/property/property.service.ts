import { UnitService } from '@modules/unit/unit.service';
import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Property } from '@schema/property.entity';
import { Repository } from 'typeorm';
import {
  CreateUnitFromPropertyDto,
  PropertyCreateDto,
  PropertyUpdateDto,
} from './property.dto';

@Injectable()
export class PropertyService {
  constructor(
    @InjectRepository(Property)
    private readonly repository: Repository<Property>,
    @Inject(UnitService)
    private readonly unitService: UnitService,
  ) {}

  async createPropertyWithUnits(payload: PropertyCreateDto) {
    const property = this.repository.create(payload);
    const entity = await this.repository.save(property);
    this.unitService.saveManyByProperty(entity, payload.units);
    return entity;
  }

  async findOne(id: string) {
    return await this.repository.findOneOrFail({
      where: { id },
    });
  }

  async findAllWithUnits() {
    return await this.repository.find({
      relations: { units: true },
    });
  }

  async findAllWithoutUnits() {
    return await this.repository.find();
  }

  async update(id: string, payload: PropertyUpdateDto) {
    const entity = await this.repository.findOneOrFail({
      where: { id },
    });
    Object.assign(entity, payload);
    return await entity.save();
  }

  async addUnits(id: string, units: CreateUnitFromPropertyDto[]) {
    const property = await this.findOne(id);
    return await this.unitService.saveManyByProperty(property, units);
  }

  async removeOne(id: string) {
    const entity = await this.repository.findOneOrFail({
      where: { id },
    });
    return await this.repository.remove(entity);
  }

  async resetAll() {
    await this.repository.createQueryBuilder().delete().execute();
    return 'All Properties & Units have been deleted';
  }
}
