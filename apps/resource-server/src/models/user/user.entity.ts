import {
  Entity,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  BaseEntity,
  ObjectIdColumn,
  Index,
} from 'typeorm';
import { Session } from '../session/session.entity';
import { UserEntity } from 'nestjs-session-store';

@Entity()
@Index(['email'], { unique: true })
export class User extends BaseEntity implements UserEntity {
  @ObjectIdColumn() id: string;

  @CreateDateColumn() creation: Date;

  @UpdateDateColumn() modified: Date;

  @Column() public accessToken: string;

  @Column() public refreshToken: string;

  @Column() public name: string;

  @Column() public email: string;

  @Column() public profileId: string;

  @OneToMany(type => Session, session => session.user)
  public sessions: Session[];
}
