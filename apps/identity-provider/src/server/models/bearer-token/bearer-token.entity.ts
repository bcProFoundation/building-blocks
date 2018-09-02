import { Column, Entity, ManyToOne } from 'typeorm';
import { User } from '../user/user.entity';
import { Client } from '../client/client.entity';
import { DocType } from '../base.doctype';

@Entity()
export class BearerToken extends DocType {
  @Column()
  accessToken: string;

  @Column()
  refreshToken: string;

  @Column()
  redirectUri: string;

  @Column()
  scope: string;

  @Column()
  expiresIn: number;

  @ManyToOne(type => User, user => user.tokens, { eager: true })
  user: User;

  @ManyToOne(type => Client, client => client.tokens, { eager: true })
  client: Client;
}
