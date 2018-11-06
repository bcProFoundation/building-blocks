import { Entity, BaseEntity, ObjectIdColumn, Column, ObjectID } from 'typeorm';
import * as uuidv4 from 'uuid/v4';

@Entity()
export class EmailAccount extends BaseEntity {
  @ObjectIdColumn()
  _id: ObjectID;
  @Column()
  uuid: string;
  @Column()
  socialKey: string; // uuid of Social Key
  @Column()
  user: string; // uuid of request user;
  @Column()
  accessToken: string;
  @Column()
  refreshToken: string;
  @Column()
  idToken: string;
  constructor() {
    super();
    if (!this.uuid) this.uuid = uuidv4();
  }
}
