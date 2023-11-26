import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Timeable } from './timeable.entity';
import { Unit } from './unit.entity';

@Entity()
export class Property extends Timeable {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column()
  title: string;

  @Column({ nullable: false })
  public location: string;

  /*_____________________RELATIONS_____________________*/

  @OneToMany(() => Unit, (unit) => unit.property, {
    onDelete: 'CASCADE',
  })
  public units: Unit[];

  constructor(entity?: Partial<Property>) {
    super();
    Object.assign(this, entity);
  }
}
