import { Entity, Column, BaseEntity, ObjectIdColumn, Index } from 'typeorm';

@Entity()
@Index(['name'], { unique: true })
export class Scope extends BaseEntity {
  @ObjectIdColumn()
  id: string;

  @Column()
  name: string;

  @Column()
  description: string;
}
