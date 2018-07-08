import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  Index,
  ObjectIdColumn,
} from 'typeorm';
import { SessionEntity } from 'nestjs-session-store';
import { User } from '../user/user.entity';

@Entity()
@Index(['sid'], { unique: true })
export class Session extends BaseEntity implements SessionEntity {
  @ObjectIdColumn() id: string;

  @Column() sid: string;

  @Column() expiresAt: number;

  @Column() cookie: string;

  @Column() passport: string;

  @Column({ type: 'varchar', length: 1000 })
  authorize: string;

  @ManyToOne(type => User, user => user.sessions)
  user: User;
}
