import { Column, Entity, BaseEntity, ObjectID, ObjectIdColumn } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { SERVICE } from '../../../constants/app-strings';

@Entity()
export class ServerSettings extends BaseEntity {
  @ObjectIdColumn()
  _id: ObjectID;

  @Column()
  uuid: string;

  @Column()
  appURL: string;

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
  callbackURLs: string[];

  @Column()
  revocationURL: string;

  @Column()
  communicationServerSystemEmailAccount: string;

  @Column()
  service: string = SERVICE;

  constructor() {
    super();
    if (!this.uuid) this.uuid = uuidv4();
  }
}
