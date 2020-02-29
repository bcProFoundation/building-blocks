import { Entity, BaseEntity, ObjectIdColumn, Column, ObjectID } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

@Entity()
export class TokenCache extends BaseEntity {
  @ObjectIdColumn()
  _id: ObjectID;
  @Column()
  accessToken: string;
  @Column()
  refreshToken: string;
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
