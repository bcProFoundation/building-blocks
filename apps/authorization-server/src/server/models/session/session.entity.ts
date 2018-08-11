import { BaseEntity, Column, Entity, ObjectIdColumn } from 'typeorm';
import { SessionEntity } from 'nestjs-session-store';
import { User } from '../user/user.entity';

@Entity()
export class Session extends BaseEntity implements SessionEntity {
  @ObjectIdColumn()
  id: string;

  @Column()
  sid: string;

  @Column()
  expiresAt: number;

  @Column()
  cookie: string;

  @Column()
  passport: string;

  @Column()
  authorize: string;

  @Column(type => User)
  user: User;
}
