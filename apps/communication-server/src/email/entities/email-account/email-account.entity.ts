import { Entity, BaseEntity, ObjectIdColumn, Column, ObjectID } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

@Entity()
export class EmailAccount extends BaseEntity {
  @ObjectIdColumn()
  _id: ObjectID;
  @Column()
  uuid: string;
  @Column()
  name: string;
  @Column()
  host: string;
  @Column()
  user: string;
  @Column()
  from: string;
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
  @Column()
  owner: string; // uuid of owner user
  @Column()
  sharedWithUsers: string[];
  constructor() {
    super();
    if (!this.uuid) this.uuid = uuidv4();
  }
}
