import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { Lease } from '@schema/lease.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TenantService } from '@modules/tenant/tenant.service';
import { UnitService } from '@modules/unit/unit.service';
import { LeaseCreateDto } from '../lease.dto';
import { LeaseService } from '../lease.service';
import { LeaseStatusEnum } from '@common/enums/lease-status.enum';

describe('LeaseService', () => {
  let service: LeaseService;
  let repository: Repository<Lease>;
  let unitService: UnitService;
  let tenantService: TenantService;

  const mockRepository = {
    findOneOrFail: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    remove: jest.fn(),
    createQueryBuilder: jest.fn().mockReturnThis(),
    leftJoinAndSelect: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    andWhere: jest.fn().mockReturnThis(),
    setParameters: jest.fn().mockReturnThis(),
    getOne: jest.fn(),
    getMany: jest.fn(),
  };

  const mockUnitService = {
    findOne: jest.fn(),
  };

  const mockTenantService = {
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LeaseService,
        {
          provide: getRepositoryToken(Lease),
          useValue: mockRepository,
        },
        {
          provide: UnitService,
          useValue: mockUnitService,
        },
        {
          provide: TenantService,
          useValue: mockTenantService,
        },
      ],
    }).compile();

    service = module.get<LeaseService>(LeaseService);
    repository = module.get<Repository<Lease>>(getRepositoryToken(Lease));
    unitService = module.get<UnitService>(UnitService);
    tenantService = module.get<TenantService>(TenantService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('leaseUnit', () => {
    it('should lease a unit', async () => {
      const leaseCreateDto: LeaseCreateDto = {
        unitId: 'unit-id',
        tenantId: 'tenant-id',
        leaseStart: new Date('2023-01-01'),
        leaseEnd: new Date('2023-12-31'),
      };

      mockUnitService.findOne.mockResolvedValue({ id: leaseCreateDto.unitId });
      mockTenantService.findOne.mockResolvedValue({
        id: leaseCreateDto.tenantId,
      });
      mockRepository.save.mockResolvedValue({ ...leaseCreateDto });

      const result = await service.leaseUnit(leaseCreateDto);
      expect(mockUnitService.findOne).toHaveBeenCalledWith(
        leaseCreateDto.unitId,
      );
      expect(mockTenantService.findOne).toHaveBeenCalledWith(
        leaseCreateDto.tenantId,
      );
      expect(mockRepository.save).toHaveBeenCalledWith(expect.any(Object));
      expect(result).toEqual(expect.any(Object));
    });
  });

  describe('terminateLease', () => {
    it('should terminate an active lease', async () => {
      const leaseId = 'lease-id';
      const lease = {
        id: leaseId,
        status: LeaseStatusEnum.ACTIVE,
        save: jest.fn(),
      };
      mockRepository.findOneOrFail.mockResolvedValue(lease);
      await service.terminateLease(leaseId);
      expect(mockRepository.findOneOrFail).toHaveBeenCalledWith({
        where: { id: leaseId },
      });
      expect(lease.status).toBe(LeaseStatusEnum.TERMINATED);
      expect(lease.save).toHaveBeenCalled();
    });

    it('should throw an error if the lease is already terminated', async () => {
      const leaseId = 'lease-id';
      const lease = {
        id: leaseId,
        status: LeaseStatusEnum.TERMINATED,
        save: jest.fn(),
      };
      mockRepository.findOneOrFail.mockResolvedValue(lease);
      await expect(service.terminateLease(leaseId)).rejects.toThrow(
        'Lease is already terminated',
      );
    });
  });

  describe('checkForAvailability', () => {
    it('should check for unit availability', async () => {
      const unitId = 'unit-id';
      const leaseStart = new Date('2023-01-01');
      const leaseEnd = new Date('2023-12-31');
      mockRepository.createQueryBuilder().getOne.mockResolvedValue(null);
      await service.checkForAvailability(unitId, leaseStart, leaseEnd);

      expect(mockRepository.createQueryBuilder().getOne).toHaveBeenCalled();
    });

    it('should throw an error if the unit is not available', async () => {
      const unitId = 'unit-id';
      const leaseStart = new Date('2023-01-01');
      const leaseEnd = new Date('2023-12-31');
      mockRepository.createQueryBuilder().getOne.mockResolvedValue({});

      await expect(
        service.checkForAvailability(unitId, leaseStart, leaseEnd),
      ).rejects.toThrow('Unit is not available for this period');
    });
  });

  describe('findAll', () => {
    it('should find all leases', async () => {
      const leases = [{ id: 'lease1' }, { id: 'lease2' }];
      mockRepository.find.mockResolvedValue(leases);

      const result = await service.findAll();

      expect(result).toEqual(leases);
      expect(mockRepository.find).toHaveBeenCalledWith({
        relations: { unit: true, tenant: true },
      });
    });
  });

  describe('findTenantLeases', () => {
    it('should find leases for a tenant', async () => {
      const tenantId = 'tenant-id';
      const leases = [{ id: 'lease1', tenant: { id: tenantId } }];
      mockRepository.find.mockResolvedValue(leases);
      const result = await service.findTenantLeases(tenantId);

      expect(mockRepository.find).toHaveBeenCalledWith({
        where: { tenant: { id: tenantId } },
      });
      expect(result).toEqual(leases);
    });
  });

  describe('findTenantLeasesByStatus', () => {
    it('should find leases for a tenant by status', async () => {
      const tenantId = 'tenant-id';
      const status = LeaseStatusEnum.ACTIVE;
      const leases = [{ id: 'lease1', tenant: { id: tenantId }, status }];
      mockRepository.find.mockResolvedValue(leases);

      const result = await service.findTenantLeasesByStatus(tenantId, status);

      expect(mockRepository.find).toHaveBeenCalledWith({
        where: { tenant: { id: tenantId }, status },
        relations: { unit: true, tenant: true },
      });
      expect(result).toEqual(leases);
    });
  });

  describe('findUnitLeases', () => {
    it('should find leases for a unit', async () => {
      const unitId = 'unit-id';
      const leases = [{ id: 'lease1', unit: { id: unitId } }];
      mockRepository.find.mockResolvedValue(leases);

      const result = await service.findUnitLeases(unitId);

      expect(mockRepository.find).toHaveBeenCalledWith({
        where: { unit: { id: unitId } },
      });
      expect(result).toEqual(leases);
    });
  });

  describe('findUnitLeasesByStatus', () => {
    it('should find leases for a unit by status', async () => {
      const unitId = 'unit-id';
      const status = LeaseStatusEnum.ACTIVE;
      const leases = [{ id: 'lease1', unit: { id: unitId }, status }];
      mockRepository.find.mockResolvedValue(leases);

      const result = await service.findUnitLeasesByStatus(unitId, status);

      expect(mockRepository.find).toHaveBeenCalledWith({
        where: { unit: { id: unitId }, status },
        relations: { unit: true, tenant: true },
      });
      expect(result).toEqual(leases);
    });
  });

  describe('findManyLeasesByStatus', () => {
    it('should find leases by status', async () => {
      const status = LeaseStatusEnum.ACTIVE;
      const leases = [{ id: 'lease1', status }];
      mockRepository.find.mockResolvedValue(leases);

      const result = await service.findManyLeasesByStatus(status);

      expect(mockRepository.find).toHaveBeenCalledWith({
        where: { status },
        relations: { unit: true, tenant: true },
      });
      expect(result).toEqual(leases);
    });
  });

  describe('delete', () => {
    it('should delete a lease', async () => {
      const leaseId = 'lease-id';
      const lease = { id: leaseId };
      mockRepository.findOneOrFail.mockResolvedValue(lease);
      mockRepository.remove.mockResolvedValue(lease);

      const result = await service.delete(leaseId);
      expect(mockRepository.findOneOrFail).toHaveBeenCalledWith({
        where: { id: leaseId },
      });
      expect(mockRepository.remove).toHaveBeenCalledWith(lease);
      expect(result).toEqual(lease);
    });
  });

  describe('findOne', () => {
    it('should find a lease by id', async () => {
      const leaseId = 'lease-id';
      const lease = { id: leaseId };
      mockRepository.findOneOrFail.mockResolvedValue(lease);

      const result = await service.findOne(leaseId);
      expect(mockRepository.findOneOrFail).toHaveBeenCalledWith({
        where: { id: leaseId },
        relations: { unit: true, tenant: true },
      });
      expect(result).toEqual(lease);
    });
  });

  describe('setLeaseStatusToExpired', () => {
    it('should set expired status for leases', async () => {
      const leases = [
        {
          id: 'lease1',
          leaseEnd: new Date(),
          status: LeaseStatusEnum.ACTIVE,
          save: jest.fn(),
        },
      ];
      mockRepository.find.mockResolvedValue(leases);

      await service.setLeaseStatusToExpired();
      for (const lease of leases) {
        expect(lease.status).toBe(LeaseStatusEnum.EXPIRED);
        expect(lease.save).toHaveBeenCalled();
      }
    });
  });
});
