import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  BaseEntity,
  ObjectIdColumn,
  Index,
} from 'typeorm';

@Entity()
@Index(['email'], { unique: true })
export class User extends BaseEntity {
  @ObjectIdColumn()
  id: string;

  @CreateDateColumn()
  creation: Date;

  @UpdateDateColumn()
  modified: Date;

  @Column()
  public accessToken: string;

  @Column()
  public refreshToken: string;

  @Column()
  public name: string;

  @Column()
  public email: string;

  @Column()
  public phone: string;

  @Column()
  public serverId: string;

  @Column()
  public otp: string;

  @Column()
  public roles: string[];
}
