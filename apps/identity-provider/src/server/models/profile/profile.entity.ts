import { Entity, Column } from 'typeorm';
import { DocType } from '../base.doctype';
import { IDTokenClaims } from '../id-token-claims.interfaces';

@Entity()
export class Profile extends DocType implements IDTokenClaims {
  @Column()
  iss: string;

  @Column()
  uuid: string;

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
  familyName: string;

  @Column()
  givenName: string;

  @Column()
  middleName: string;

  @Column()
  nickname: string;

  @Column()
  preferredUsername: string;

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
  updatedAt: Date;

  @Column()
  roles: string[];
}
