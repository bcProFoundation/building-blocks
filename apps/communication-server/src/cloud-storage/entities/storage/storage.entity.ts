import { Entity, BaseEntity, ObjectIdColumn, Column, ObjectID } from 'typeorm';

@Entity()
export class Storage extends BaseEntity {
  @ObjectIdColumn()
  _id: ObjectID;
  @Column()
  uuid: string;
  @Column()
  version: string;
  @Column()
  name: string;
  @Column()
  region: string;
  @Column()
  endpoint: string;
  @Column()
  accessKey: string;
  @Column()
  secretKey: string;
  @Column()
  bucket: string;
}
