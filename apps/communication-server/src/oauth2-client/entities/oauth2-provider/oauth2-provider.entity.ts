import { Column, Entity, BaseEntity, ObjectID, ObjectIdColumn } from 'typeorm';
import * as uuidv4 from 'uuid/v4';

@Entity()
export class OAuth2Provider extends BaseEntity {
  @ObjectIdColumn()
  _id: ObjectID;

  @Column()
  uuid: string;

  @Column()
  appName: string;

  @Column()
  authServerURL: string;

  @Column()
  clientId: string;

  @Column()
  clientSecret: string;

  @Column()
  profileURL: string;

  @Column()
  tokenURL: string;

  @Column()
  introspectionURL: string;

  @Column()
  authorizationURL: string;

  @Column()
  revocationURL: string;

  constructor() {
    super();
    if (!this.uuid) this.uuid = uuidv4();
  }
}
