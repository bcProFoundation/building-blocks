import { Column, Entity, Index } from 'typeorm';
import * as uuidv4 from 'uuid/v4';
import { DocType } from '../base.doctype';

@Entity()
export class Client extends DocType {
  @Column()
  name: string;

  @Index({ unique: true })
  @Column()
  clientId: string;

  @Column()
  clientSecret: string;

  @Column()
  isTrusted: number;

  @Column()
  redirectUris: string[];

  @Column()
  allowedScopes: string[];

  constructor() {
    super();
    if (!this.clientId) this.clientId = uuidv4();
  }
}
