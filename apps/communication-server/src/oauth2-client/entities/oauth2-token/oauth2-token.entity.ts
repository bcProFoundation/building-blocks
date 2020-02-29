import { Entity, BaseEntity, ObjectIdColumn, Column, ObjectID } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

@Entity()
export class OAuth2Token extends BaseEntity {
  @ObjectIdColumn()
  _id: ObjectID;
  @Column()
  uuid: string;
  @Column()
  oauth2Provider: string; // uuid of Social Key
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
