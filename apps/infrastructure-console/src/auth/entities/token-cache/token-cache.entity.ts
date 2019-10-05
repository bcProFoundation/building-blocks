import { Entity, BaseEntity, ObjectIdColumn, Column, ObjectID } from 'typeorm';
import * as uuidv4 from 'uuid/v4';

@Entity()
export class TokenCache extends BaseEntity {
  @ObjectIdColumn()
  _id: ObjectID;
  @Column()
  accessToken: string;
  @Column()
  uuid: string;
  @Column()
  active: boolean;
  @Column()
  exp: number;
  @Column()
  sub: string;
  @Column()
  scope: string[];
  @Column()
  roles: string[];
  @Column()
  clientId: string;
  @Column()
  trustedClient: boolean;
  constructor() {
    super();
    if (!this.uuid) this.uuid = uuidv4();
  }
}
