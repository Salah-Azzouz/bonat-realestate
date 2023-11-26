import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { Tenant } from '@schema/tenant.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { LeaseStatusEnum } from '@common/enums/lease-status.enum';
import { TenantCreateDto } from '../tenant.dto';
import { TenantService } from '../tenant.service';

describe('TenantService', () => {
  let service: TenantService;
  let repository: Repository<Tenant>;

  const mockRepository = {
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    findOneOrFail: jest.fn(),
    remove: jest.fn(),
    createQueryBuilder: jest.fn(() => ({
      delete: jest.fn().mockReturnThis(),
      execute: jest.fn(),
    })),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TenantService,
        {
          provide: getRepositoryToken(Tenant),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<TenantService>(TenantService);
    repository = module.get<Repository<Tenant>>(getRepositoryToken(Tenant));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a tenant', async () => {
      const tenantCreateDto: TenantCreateDto = {
        name: 'John Doe',
        phone: '+1 123 456 7890',
      };
      const createdTenant = new Tenant(tenantCreateDto);
      mockRepository.save.mockResolvedValue(createdTenant);
      mockRepository.findOne.mockResolvedValue(null);

      const result = await service.create(tenantCreateDto);

      expect(result).toEqual(createdTenant);
      expect(mockRepository.save).toHaveBeenCalledWith(createdTenant);
    });
  });

  describe('findAll', () => {
    it('should retrieve all tenants', async () => {
      const mockTenants = [{ name: 'John Doe', phone: '+1 123 456 7890' }];
      mockRepository.find.mockResolvedValue(mockTenants);
      const result = await service.findAll();
      expect(result).toEqual(mockTenants);
      expect(mockRepository.find).toHaveBeenCalled();
    });
  });

  describe('findAllWithLeases', () => {
    it('should retrieve all tenants with their leases', async () => {
      const mockTenants = [
        { name: 'John Doe', phone: '+1 123 456 7890', leases: [] },
      ];
      mockRepository.find.mockResolvedValue(mockTenants);
      const result = await service.findAllWithLeases();
      expect(result).toEqual(mockTenants);
      expect(mockRepository.find).toHaveBeenCalledWith({
        relations: { leases: true },
      });
    });
  });

  describe('findAllWithSpecificLeaseStatus', () => {
    it('should retrieve all tenants with a specific lease status', async () => {
      const status = LeaseStatusEnum.ACTIVE;
      const mockTenants = [
        { name: 'John Doe', phone: '+1 123 456 7890', leases: [{ status }] },
      ];
      mockRepository.find.mockResolvedValue(mockTenants);

      const result = await service.findAllWithSpecificLeaseStatus(status);

      expect(result).toEqual(mockTenants);
      expect(mockRepository.find).toHaveBeenCalledWith({
        relations: { leases: true },
        where: { leases: { status } },
      });
    });
  });

  describe('findOne', () => {
    it('should find a tenant by id', async () => {
      const tenantId = 'tenant-id';
      const mockTenant = {
        id: tenantId,
        name: 'John Doe',
        phone: '+1 123 456 7890',
      };
      mockRepository.findOneOrFail.mockResolvedValue(mockTenant);
      const result = await service.findOne(tenantId);
      expect(result).toEqual(mockTenant);
      expect(mockRepository.findOneOrFail).toHaveBeenCalledWith({
        where: { id: tenantId },
      });
    });
  });

  describe('remove', () => {
    it('should remove a tenant', async () => {
      const tenantId = 'tenant-id';
      const tenantToRemove = {
        id: tenantId,
        name: 'John Doe',
        phone: '+1 123 456 7890',
      };
      mockRepository.findOneOrFail.mockResolvedValue(tenantToRemove);
      mockRepository.remove.mockResolvedValue(tenantToRemove);
      const result = await service.remove(tenantId);

      expect(result).toEqual(tenantToRemove);
      expect(mockRepository.findOneOrFail).toHaveBeenCalledWith({
        where: { id: tenantId },
      });
      expect(mockRepository.remove).toHaveBeenCalledWith(tenantToRemove);
    });
  });

  describe('checkIfPhoneNumberIsUnique', () => {
    it('should throw an error if the phone number is not unique', async () => {
      const phone = '+1 123 456 7890';
      const existingTenant = { name: 'John Doe', phone };
      mockRepository.findOne.mockResolvedValue(existingTenant);

      await expect(service.checkIfPhoneNumberIsUnique(phone)).rejects.toThrow(
        'Phone number already exists',
      );
    });

    it('should not throw an error if the phone number is unique', async () => {
      const phone = '+1 123 456 7890';
      mockRepository.findOne.mockResolvedValue(null);
      await expect(
        service.checkIfPhoneNumberIsUnique(phone),
      ).resolves.not.toThrow();
    });
  });
});
