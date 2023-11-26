import { Test, TestingModule } from '@nestjs/testing';
import { UnitService } from '@modules/unit/unit.service';
import { Repository } from 'typeorm';
import { Property } from '@schema/property.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

import { PropertyTypeEnum } from '@common/enums/property-type.enum';
import {
  CreateUnitFromPropertyDto,
  PropertyCreateDto,
  PropertyUpdateDto,
} from '../property.dto';
import { PropertyService } from '../property.service';

describe('PropertyService', () => {
  let service: PropertyService;
  let repository: Repository<Property>;
  let unitService: UnitService;

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOneOrFail: jest.fn(),
    find: jest.fn(),
    remove: jest.fn(),
    createQueryBuilder: jest.fn(() => ({
      delete: jest.fn().mockReturnThis(),
      execute: jest.fn(),
    })),
  };

  const mockUnitService = {
    saveManyByProperty: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PropertyService,
        {
          provide: getRepositoryToken(Property),
          useValue: mockRepository,
        },
        {
          provide: UnitService,
          useValue: mockUnitService,
        },
      ],
    }).compile();

    service = module.get<PropertyService>(PropertyService);
    repository = module.get<Repository<Property>>(getRepositoryToken(Property));
    unitService = module.get<UnitService>(UnitService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createPropertyWithUnits', () => {
    it('should create a property with units', async () => {
      const propertyCreateDto: PropertyCreateDto = {
        title: 'Property 1',
        location: 'Jakarta',
        units: [
          {
            pricePerSquareMeter: 100000,
            numberOfRooms: 2,
            type: PropertyTypeEnum.APARTMENT,
          },
        ],
      };
      const createdProperty = { ...propertyCreateDto, id: 'property-id' };
      mockRepository.create.mockReturnValue(createdProperty);
      mockRepository.save.mockResolvedValue(createdProperty);

      const result = await service.createPropertyWithUnits(propertyCreateDto);
      expect(result).toEqual(createdProperty);
      expect(mockRepository.create).toHaveBeenCalledWith(propertyCreateDto);
      expect(mockRepository.save).toHaveBeenCalledWith(createdProperty);
      expect(mockUnitService.saveManyByProperty).toHaveBeenCalledWith(
        createdProperty,
        propertyCreateDto.units,
      );
    });
  });

  describe('findOne', () => {
    it('should find a property by id', async () => {
      const propertyId = 'property-id';
      const mockProperty = {
        id: propertyId,
        title: 'Property 1',
        location: 'Jakarta',
      };
      mockRepository.findOneOrFail.mockResolvedValue(mockProperty);

      const result = await service.findOne(propertyId);
      expect(result).toEqual(mockProperty);
      expect(mockRepository.findOneOrFail).toHaveBeenCalledWith({
        where: { id: propertyId },
      });
    });
  });

  describe('findAllWithUnits', () => {
    it('should retrieve all properties with their units', async () => {
      const mockProperties = [
        { id: '1', title: 'Property 1', location: 'Jakarta', units: [] },
      ];
      mockRepository.find.mockResolvedValue(mockProperties);

      const result = await service.findAllWithUnits();
      expect(result).toEqual(mockProperties);
      expect(mockRepository.find).toHaveBeenCalledWith({
        relations: { units: true },
      });
    });
  });

  describe('findAllWithoutUnits', () => {
    it('should retrieve all properties without their units', async () => {
      const mockProperties = [
        { id: '1', title: 'Property 1', location: 'Jakarta' },
      ];
      mockRepository.find.mockResolvedValue(mockProperties);
      const result = await service.findAllWithoutUnits();
      expect(result).toEqual(mockProperties);
      expect(mockRepository.find).toHaveBeenCalled();
    });
  });

  describe('removeOne', () => {
    it('should remove a property', async () => {
      const propertyId = 'property-id';
      const propertyToRemove = {
        id: propertyId,
        title: 'Property 1',
        location: 'Jakarta',
      };
      mockRepository.findOneOrFail.mockResolvedValue(propertyToRemove);
      mockRepository.remove.mockResolvedValue(propertyToRemove);
      const result = await service.removeOne(propertyId);

      expect(result).toEqual(propertyToRemove);

      expect(mockRepository.findOneOrFail).toHaveBeenCalledWith({
        where: { id: propertyId },
      });

      expect(mockRepository.remove).toHaveBeenCalledWith(propertyToRemove);
    });
  });
});
