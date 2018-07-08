import { BaseEntity, Column, Entity, ObjectIdColumn, Index } from 'typeorm';

@Entity()
@Index(['clientID'], { unique: true })
export class Client extends BaseEntity {
  @ObjectIdColumn() id: string;

  @Column() clientID: string;

  @Column() clientSecret: string;

  @Column() callbackURL: string;

  @Column() authorizationURL: string;

  @Column() tokenURL: string;

  @Column() accessToken: string;

  @Column() refreshToken: string;

  @Column() introspectionURL: string;

  @Column() profileURL: string;
}
