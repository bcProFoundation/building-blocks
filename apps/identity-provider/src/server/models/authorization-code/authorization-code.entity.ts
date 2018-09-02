import { Column, Entity, ManyToOne } from 'typeorm';
import { User } from '../user/user.entity';
import { Client } from '../client/client.entity';
import { DocType } from '../base.doctype';

@Entity()
export class AuthorizationCode extends DocType {
  @Column()
  code: string;

  @Column()
  redirectUri: string;

  @ManyToOne(type => Client, client => client.codes, { eager: true })
  client: Client;

  @ManyToOne(type => User, user => user.codes, { eager: true })
  user: User;
}
