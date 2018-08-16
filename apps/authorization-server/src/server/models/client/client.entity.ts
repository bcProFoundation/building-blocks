import { Column, Entity, Index, Generated } from 'typeorm';
import { DocType } from '../base.doctype';
import { Role } from '../role/role.entity';
import * as uuid from 'uuid/v4';
import { Scope } from '../scope/scope.entity';

@Entity()
@Index(['clientId'], { unique: true })
export class Client extends DocType {
  @Column()
  name: string;

  @Column()
  clientId: string;

  @Column()
  clientSecret: string;

  @Column()
  isTrusted: number;

  @Column()
  redirectUris: string[];

  @Column(type => Role)
  allowedRoles: Role[];

  @Column(type => Scope)
  allowedScopes: Scope[];

  constructor() {
    super();
    if (!this.clientId) this.clientId = uuid();
  }
}
