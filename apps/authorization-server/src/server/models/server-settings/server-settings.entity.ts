import { Column, Entity, BaseEntity, ObjectID, ObjectIdColumn } from 'typeorm';
import * as uuidv4 from 'uuid/v4';

@Entity()
export class ServerSettings extends BaseEntity {
  @ObjectIdColumn()
  _id: ObjectID;

  @Column()
  uuid: string;

  @Column()
  issuerUrl: string;

  constructor() {
    super();
    if (!this.uuid) this.uuid = uuidv4();
  }
}
