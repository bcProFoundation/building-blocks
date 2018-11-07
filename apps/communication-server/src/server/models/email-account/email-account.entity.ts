import {
  Entity,
  BaseEntity,
  Index,
  ObjectIdColumn,
  Column,
  ObjectID,
} from 'typeorm';

@Entity()
@Index(['user'], { unique: true })
export class EmailAccount extends BaseEntity {
  @ObjectIdColumn()
  _id: ObjectID;
  @Column()
  host: string;
  @Column()
  user: string;
  @Column()
  pass: string;
  @Column()
  secure: boolean;
  @Column()
  port: number;
  @Column()
  pool: boolean;
  @Column()
  tlsRejectUnauthorized: boolean;
  @Column()
  type: string; // set to 'OAuth2' for OAuth2 Accounts
}
