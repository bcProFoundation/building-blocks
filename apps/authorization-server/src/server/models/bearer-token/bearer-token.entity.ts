import { Column, Entity } from 'typeorm';
import { User } from '../user/user.entity';
import { Client } from '../client/client.entity';
import { DocType } from '../base.doctype';
import { Scope } from '../scope/scope.entity';

@Entity()
export class BearerToken extends DocType {
  @Column()
  accessToken: string;

  @Column()
  refreshToken: string;

  @Column()
  redirectUri: string;

  @Column(type => Scope)
  scope: Scope[];

  @Column()
  expiresIn: number;

  @Column(type => User)
  user: User;

  @Column(type => Client)
  client: Client;
}
