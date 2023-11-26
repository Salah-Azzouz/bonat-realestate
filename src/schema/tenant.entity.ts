import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Lease } from './lease.entity';
import { Timeable } from './timeable.entity';

@Entity()
export class Tenant extends Timeable {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column()
  name: string;

  @Column()
  phone: string;

  /*_____________________RELATIONS_____________________*/

  @OneToMany(() => Lease, (lease) => lease.tenant, {
    onDelete: 'SET NULL',
  })
  public leases: Lease[];

  constructor(entity?: Partial<Tenant>) {
    super();
    Object.assign(this, entity);
  }
}
