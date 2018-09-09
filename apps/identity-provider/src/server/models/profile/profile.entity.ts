import { Entity, Column } from 'typeorm';
import { DocType } from '../base.doctype';
import { IDTokenClaims } from '../id-token-claims.interfaces';

@Entity()
export class Profile extends DocType implements IDTokenClaims {
  @Column()
  iss: string;

  @Column()
  sub: string;

  @Column()
  aud: string;

  @Column()
  exp: number;

  @Column()
  iat: number;

  @Column()
  email: string;

  @Column()
  verified_email: string;

  @Column()
  name: string;

  @Column()
  family_name: string;

  @Column()
  given_name: string;

  @Column()
  middle_name: string;

  @Column()
  nickname: string;

  @Column()
  preferred_username: string;

  @Column()
  profile: string;

  @Column()
  picture: string;

  @Column()
  website: string;

  @Column()
  gender: string;

  @Column()
  birthdate: Date;

  @Column()
  zoneinfo: string;

  @Column()
  locale: string;

  @Column()
  updated_at: Date;

  @Column()
  roles: string[];
}
