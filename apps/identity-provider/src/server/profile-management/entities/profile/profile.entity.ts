import {
  Entity,
  Column,
  ObjectIdColumn,
  Index,
  CreateDateColumn,
  UpdateDateColumn,
  ObjectID,
  BaseEntity,
} from 'typeorm';
import { IDTokenClaims } from '../../../auth/entities/token-cache/id-token-claims.interfaces';

@Entity()
export class Profile extends BaseEntity implements IDTokenClaims {
  @ObjectIdColumn()
  _id: ObjectID;

  @Index({ unique: true })
  @Column()
  uuid: string;

  @CreateDateColumn()
  creation: Date;

  @UpdateDateColumn()
  modified: Date;

  // save user id as string
  @Column()
  createdBy: string;

  // save user id as string
  @Column()
  modifiedBy: string;

  @Column()
  iss: string;

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
