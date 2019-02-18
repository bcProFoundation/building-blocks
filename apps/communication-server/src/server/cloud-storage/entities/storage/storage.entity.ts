import { Entity, BaseEntity, ObjectIdColumn, Column, ObjectID } from 'typeorm';
import * as uuidv4 from 'uuid/v4';

@Entity()
export class Storage extends BaseEntity {
  @ObjectIdColumn()
  _id: ObjectID;
  @Column()
  uuid: string;
  @Column()
  version: string;
  @Column()
  region: string;
  @Column()
  endpoint: string;
  @Column()
  accesskey: string;
  @Column()
  secretKey: string;
  @Column()
  bucket: string;
  constructor() {
    super();
    if (!this.uuid) this.uuid = uuidv4();
  }
}
