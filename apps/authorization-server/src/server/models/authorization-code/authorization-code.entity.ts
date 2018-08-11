import { Column, Entity } from 'typeorm';
import { User } from '../user/user.entity';
import { Client } from '../client/client.entity';
import { DocType } from '../base.doctype';

@Entity()
export class AuthorizationCode extends DocType {
  @Column()
  code: string;

  @Column()
  redirectUri: string;

  @Column(type => Client)
  client: Client;

  @Column(type => User)
  user: User;
}
