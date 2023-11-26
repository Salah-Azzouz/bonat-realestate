import { LeaseStatusEnum } from '@common/enums/lease-status.enum';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Tenant } from './tenant.entity';
import { Timeable } from './timeable.entity';
import { Unit } from './unit.entity';

@Entity()
export class Lease extends Timeable {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column()
  leaseStart: Date;

  @Column()
  leaseEnd: Date;

  @Column({
    type: 'enum',
    enum: LeaseStatusEnum,
    default: LeaseStatusEnum.ACTIVE,
  })
  status: LeaseStatusEnum;

  /*_____________________RELATIONS_____________________*/
  @ManyToOne(() => Unit, (unit) => unit.leases, {
    onDelete: 'CASCADE',
  })
  public unit: Unit;

  @ManyToOne(() => Tenant, (tenant) => tenant.leases, {
    onDelete: 'CASCADE',
  })
  public tenant: Tenant;

  constructor(entity?: Partial<Lease>) {
    super();
    Object.assign(this, entity);
  }
}
