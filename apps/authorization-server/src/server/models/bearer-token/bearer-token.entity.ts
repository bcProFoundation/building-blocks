import { Column, Entity } from 'typeorm';
import { DocType } from '../base.doctype';

@Entity()
export class BearerToken extends DocType {
  @Column()
  accessToken: string;

  @Column()
  refreshToken: string;

  @Column()
  redirectUris: string[];

  @Column()
  scope: string[];

  @Column()
  expiresIn: number;

  @Column()
  user: string;

  @Column()
  client: string;
}
