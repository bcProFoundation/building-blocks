import {
  BaseEntity,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
} from 'typeorm';
import { SessionEntity } from 'nestjs-session-store';
import { User } from '../user/user.entity';

@Entity()
export class Session extends BaseEntity implements SessionEntity {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  sid: string;

  @Column()
  expiresAt: number;

  @Column()
  cookie: string;

  @Column()
  passport: string;

  @Column({ type: 'varchar', length: 1000 })
  authorize: string;

  @ManyToOne(type => User, user => user.sessions)
  user: User;
}
