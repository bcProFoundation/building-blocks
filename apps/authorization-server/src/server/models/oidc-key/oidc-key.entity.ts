import { Entity, Column, BaseEntity, ObjectIdColumn, ObjectID } from 'typeorm';
import * as uuidv4 from 'uuid/v4';

@Entity()
export class OIDCKey extends BaseEntity {
  @ObjectIdColumn()
  _id: ObjectID;

  @Column()
  uuid: string;

  /**
   * Store UUID of KeyPair
   */
  @Column()
  keyPair: {};

  constructor() {
    super();
    if (!this.uuid) this.uuid = uuidv4();
  }
}
