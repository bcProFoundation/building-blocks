import { Entity, Column, BaseEntity, ObjectIdColumn, ObjectID } from 'typeorm';
import * as uuidv4 from 'uuid/v4';

@Entity()
export class AuthData extends BaseEntity {
  @ObjectIdColumn()
  _id: ObjectID;

  @Column()
  uuid: string;

  /**
   * Store UUID of AuthData on any entity to store secrets
   */
  @Column()
  password: string | number;

  constructor() {
    super();
    if (!this.uuid) this.uuid = uuidv4();
  }
}
