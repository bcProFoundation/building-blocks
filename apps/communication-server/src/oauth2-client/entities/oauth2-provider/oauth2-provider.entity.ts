import { Column, Entity, BaseEntity, ObjectID, ObjectIdColumn } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

export const OAUTH2_PROVIDER = 'oauth2_provider';

@Entity(OAUTH2_PROVIDER)
export class OAuth2Provider extends BaseEntity {
  @ObjectIdColumn()
  _id: ObjectID;

  @Column()
  uuid: string;

  @Column()
  name: string;

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

  @Column()
  scope: string[];

  constructor() {
    super();
    if (!this.uuid) this.uuid = uuidv4();
  }
}
