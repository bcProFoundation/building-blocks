import {
  Column,
  Entity,
  BaseEntity,
  ObjectID,
  Index,
  ObjectIdColumn,
} from 'typeorm';

@Entity()
export class Session extends BaseEntity {
  @ObjectIdColumn()
  _id: ObjectID;

  @Column()
  @Index({ unique: true })
  sid: string;

  @Column()
  expiresAt: number;

  @Column()
  cookie: string;

  @Column()
  passport: string;

  @Column()
  authorize: string;

  @Column()
  user: string;
}
