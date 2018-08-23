import { Entity, Column, BaseEntity, ObjectIdColumn, ObjectID } from 'typeorm';
import * as uuidv4 from 'uuid/v4';

@Entity()
export class AuthData extends BaseEntity {
  @ObjectIdColumn()
  _id: ObjectID;

  @Column()
  uuid: string;

  /**
   * Store UUID of AuthData
   */
  @Column()
  password: string;

  constructor() {
    super();
    if (!this.uuid) this.uuid = uuidv4();
  }
}
