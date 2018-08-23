import {
  Column,
  Entity,
  Index,
  BaseEntity,
  ObjectIdColumn,
  ObjectID,
} from 'typeorm';

@Entity()
@Index(['code'], { unique: true })
export class AuthorizationCode extends BaseEntity {
  @ObjectIdColumn()
  _id: ObjectID;

  @Column()
  code: string;

  @Column()
  redirectUri: string;

  @Column()
  client: string;

  @Column()
  user: string;

  @Column()
  scope: string[];
}
