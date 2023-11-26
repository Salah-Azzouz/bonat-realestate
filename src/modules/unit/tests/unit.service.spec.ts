import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { Unit } from '@schema/unit.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { PropertyTypeEnum } from '@common/enums/property-type.enum';
import { SearchForUnitsDto, UnitPayloadDto } from '../unit.dto';
import { UnitService } from '../unit.service';
import { Property } from '@schema/property.entity';

describe('UnitService', () => {
  let service: UnitService;
  let repository: Repository<Unit>;

  const mockRepository = {
    find: jest.fn(),
    findOneOrFail: jest.fn(),
    save: jest.fn(),
    remove: jest.fn(),
    create: jest.fn(),
    createQueryBuilder: jest.fn(() => ({
      leftJoinAndSelect: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      getOne: jest.fn(),
    })),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UnitService,
        {
          provide: getRepositoryToken(Unit),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<UnitService>(UnitService);
    repository = module.get<Repository<Unit>>(getRepositoryToken(Unit));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should retrieve all units', async () => {
      const mockUnits = [
        {
          type: PropertyTypeEnum.APARTMENT,
          pricePerSquareMeter: 100000,
          numberOfRooms: 2,
        },
      ];
      mockRepository.find.mockResolvedValue(mockUnits);

      const result = await service.findAll();

      expect(result).toEqual(mockUnits);
      expect(mockRepository.find).toHaveBeenCalled();
    });
  });

  describe('findManyUnitsByCriteria', () => {
    it('should find units by criteria', async () => {
      const criteria: SearchForUnitsDto = {
        type: PropertyTypeEnum.APARTMENT,
        minNumberOfRooms: 1,
        maxNumberOfRooms: 3,
        minPricePerSquareMeter: 90000,
        maxPricePerSquareMeter: 110000,
      };
      const mockUnits = [
        {
          type: PropertyTypeEnum.APARTMENT,
          pricePerSquareMeter: 100000,
          numberOfRooms: 2,
        },
      ];
      mockRepository.find.mockResolvedValue(mockUnits);

      const result = await service.findManyUnitsByCriteria(criteria);

      expect(result).toEqual(mockUnits);
      expect(mockRepository.find).toHaveBeenCalledWith({
        where: {
          type: criteria.type,
          numberOfRooms: expect.anything(),
          pricePerSquareMeter: expect.anything(),
        },
      });
    });
  });

  describe('findOne', () => {
    it('should find a unit by id', async () => {
      const unitId = 'unit-id';
      const mockUnit = {
        id: unitId,
        type: PropertyTypeEnum.APARTMENT,
        pricePerSquareMeter: 100000,
        numberOfRooms: 2,
      };
      mockRepository.findOneOrFail.mockResolvedValue(mockUnit);

      const result = await service.findOne(unitId);

      expect(result).toEqual(mockUnit);
      expect(mockRepository.findOneOrFail).toHaveBeenCalledWith({
        where: { id: unitId },
      });
    });
  });

  describe('removeOne', () => {
    it('should remove a unit', async () => {
      const unitId = 'unit-id';
      const unitToRemove = {
        id: unitId,
        type: PropertyTypeEnum.APARTMENT,
        pricePerSquareMeter: 100000,
        numberOfRooms: 2,
      };
      mockRepository.findOneOrFail.mockResolvedValue(unitToRemove);
      mockRepository.remove.mockResolvedValue(unitToRemove);
      mockRepository.createQueryBuilder.mockReturnValue({
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(undefined),
      });

      const result = await service.removeOne(unitId);

      expect(result).toEqual(unitToRemove);
      expect(mockRepository.findOneOrFail).toHaveBeenCalledWith({
        where: { id: unitId },
      });
      expect(mockRepository.remove).toHaveBeenCalledWith(unitToRemove);
    });
  });

  describe('checkForActiveLeases', () => {
    it('should throw an error if there are active leases', async () => {
      const unitId = 'unit-id';
      mockRepository.createQueryBuilder.mockReturnValue({
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        getOne: jest
          .fn()
          .mockResolvedValue({ id: unitId, leases: [{ status: 'active' }] }),
      });

      await expect(service.checkForActiveLeases(unitId)).rejects.toThrow(
        'Cannot delete a unit with active leases',
      );
    });

    it('should not throw an error if there are no active leases', async () => {
      const unitId = 'unit-id';
      mockRepository.createQueryBuilder.mockReturnValue({
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(undefined),
      });

      await expect(service.checkForActiveLeases(unitId)).resolves.not.toThrow();
    });
  });

  describe('saveManyByProperty', () => {
    it('should save multiple units for a property', async () => {
      const property = new Property();
      property.id = 'property-id';

      const units: UnitPayloadDto[] = [
        {
          type: PropertyTypeEnum.APARTMENT,
          pricePerSquareMeter: 100000,
          numberOfRooms: 2,
        },
        {
          type: PropertyTypeEnum.APARTMENT,
          pricePerSquareMeter: 150000,
          numberOfRooms: 3,
        },
      ];

      const createdUnits = units.map((unit) => ({ ...unit, property }));
      mockRepository.create.mockImplementation((unit) => unit);
      mockRepository.save.mockResolvedValue(createdUnits);

      const result = await service.saveManyByProperty(property, units);

      expect(result).toEqual(createdUnits);
      expect(mockRepository.create).toHaveBeenCalledTimes(units.length);
      expect(mockRepository.save).toHaveBeenCalledWith(createdUnits);
    });
  });
});
