import { Column, Entity, OneToMany } from 'typeorm';
import { AuthorizationCode } from '../authorization-code/authorization-code.entity';
import { BearerToken } from '../bearer-token/bearer-token.entity';
import { DocType } from '../base.doctype';

@Entity()
export class Client extends DocType {
  @Column() name: string;

  // TODO: move from id to clientId
  @Column() clientId: string;

  @Column() clientSecret: string;

  @Column() isTrusted: number;

  @Column() redirectUri: string;

  @OneToMany(type => AuthorizationCode, code => code.client)
  public codes: Promise<AuthorizationCode[]>;

  @OneToMany(type => BearerToken, token => token.client)
  public tokens: Promise<BearerToken[]>;
}
