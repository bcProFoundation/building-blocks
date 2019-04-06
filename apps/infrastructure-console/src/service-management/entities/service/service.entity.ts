import { Entity, BaseEntity, Column, ObjectID, ObjectIdColumn } from 'typeorm';

@Entity()
export class Service extends BaseEntity {
  @ObjectIdColumn()
  _id: ObjectID;

  @Column()
  uuid: string;

  @Column()
  clientId: string;

  @Column()
  serviceURL: string;

  @Column()
  name: string;

  @Column()
  type: string; // uuid of service type
}
