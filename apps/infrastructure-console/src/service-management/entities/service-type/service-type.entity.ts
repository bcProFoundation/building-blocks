import { Entity, BaseEntity, Column, ObjectID, ObjectIdColumn } from 'typeorm';

@Entity()
export class ServiceType extends BaseEntity {
  @ObjectIdColumn()
  _id: ObjectID;

  @Column()
  uuid: string;

  @Column()
  name: string;
}
