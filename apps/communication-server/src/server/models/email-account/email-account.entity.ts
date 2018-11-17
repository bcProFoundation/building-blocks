import { Entity, BaseEntity, ObjectIdColumn, Column, ObjectID } from 'typeorm';
import * as uuidv4 from 'uuid/v4';

@Entity()
export class EmailAccount extends BaseEntity {
  @ObjectIdColumn()
  _id: ObjectID;
  @Column()
  uuid: string;
  @Column()
  host: string;
  @Column()
  user: string;
  @Column()
  pass: string;
  @Column()
  secure: boolean;
  @Column()
  port: number;
  @Column()
  pool: boolean;
  @Column()
  tlsRejectUnauthorized: boolean;
  @Column()
  oauth2: boolean; // set to true for OAuth2 Accounts
  constructor() {
    super();
    if (!this.uuid) this.uuid = uuidv4();
  }
}
