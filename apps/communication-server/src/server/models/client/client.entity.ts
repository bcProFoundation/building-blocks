import { BaseEntity, Column, Entity, ObjectIdColumn, Index } from 'typeorm';

@Entity()
@Index(['clientId'], { unique: true })
export class Client extends BaseEntity {
  @ObjectIdColumn()
  id: string;

  @Column()
  clientId: string;

  @Column()
  clientSecret: string;

  @Column()
  callbackURL: string;

  @Column()
  authorizationURL: string;

  @Column()
  tokenURL: string;

  @Column()
  introspectionURL: string;

  @Column()
  profileURL: string;

  @Column()
  accessToken: string;

  @Column()
  refreshToken: string;
}
