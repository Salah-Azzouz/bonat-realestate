import { PropertyTypeEnum } from '@common/enums/property-type.enum';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Lease } from './lease.entity';
import { Property } from './property.entity';
import { Timeable } from './timeable.entity';

@Entity()
export class Unit extends Timeable {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column({ type: 'bigint', nullable: false })
  public pricePerSquareMeter: number;

  @Column({ nullable: false })
  public numberOfRooms: number;

  @Column({ type: 'enum', enum: PropertyTypeEnum })
  public type: PropertyTypeEnum;

  /*_____________________RELATIONS_____________________*/

  @ManyToOne(() => Property, (property) => property.units, {
    onDelete: 'CASCADE',
  })
  public property: Property;

  @OneToMany(() => Lease, (lease) => lease.unit, {
    onDelete: 'SET NULL',
  })
  public leases: Lease[];

  constructor(entity?: Partial<Unit>) {
    super();
    Object.assign(this, entity);
  }
}
